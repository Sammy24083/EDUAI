import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Calendar,
  User,
  ArrowLeft,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Article } from '../types';
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from '../services/articleService';
import {
  hasUserLiked,
  toggleLike,
  hasUserSaved,
  toggleSave,
} from '../services/interactionService';
import { useAuth } from '../context/AuthContext';
import { ReadingProgress } from '../components/article/ReadingProgress';
import { TableOfContents } from '../components/article/TableOfContents';
import { ShareBar } from '../components/article/ShareBar';
import { FloatingActionBar } from '../components/article/FloatingActionBar';
import { CommentSection } from '../components/article/CommentSection';
import { ArticleCard } from '../components/article/ArticleCard';
import { AdBanner } from '../components/ads/AdBanner';
import { NewsletterCta } from '../components/newsletter/NewsletterCta';
import { SaveToListModal } from '../components/article/SaveToListModal';
import { ReadingInsights } from '../components/article/ReadingInsights';
import { useSEO } from '../hooks/useSEO';
import { calculateReadingTime } from '../utils/readingTime';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);

    const loadArticle = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const found = await getArticleBySlug(slug);
        if (!found) {
          setArticle(null);
          setLoading(false);
          return;
        }

        if (active) {
          setArticle(found);
          setLikesCount(found.likesCount || 0);

          // Increment view count asynchronously
          incrementArticleViews(found.id);

          // Fetch related articles
          getRelatedArticles(found.categoryId, found.id, 3).then((rel) => {
            if (active) setRelated(rel);
          });

          // Check user like and save states
          if (user) {
            hasUserLiked(found.id, user.uid).then((isLiked) => {
              if (active) setLiked(isLiked);
            });
            hasUserSaved(found.id, user.uid).then((isSaved) => {
              if (active) setSaved(isSaved);
            });
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadArticle();

    return () => {
      active = false;
    };
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like articles.');
      return;
    }
    if (!article) return;
    try {
      const nowLiked = await toggleLike(article.id, user.uid);
      setLiked(nowLiked);
      setLikesCount((prev) => (nowLiked ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to bookmark articles.');
      return;
    }
    if (!article) return;
    setIsSaveModalOpen(true);
  };

  // Dynamic SEO & Structured Data
  useSEO({
    title: article?.seoTitle || article?.title,
    description: article?.seoDescription || article?.subtitle,
    image: article?.featuredImage,
    canonicalUrl: article?.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    type: 'article',
    author: article?.authorName,
    publishedTime: article?.publishedAt || article?.createdAt,
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: article.title,
          description: article.subtitle || article.seoDescription,
          image: article.featuredImage,
          datePublished: article.publishedAt || article.createdAt,
          dateModified: article.updatedAt,
          author: {
            '@type': 'Person',
            name: article.authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: 'EduAI',
            logo: {
              '@type': 'ImageObject',
              url: 'https://eduai.media/logo.png',
            },
          },
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-neutral-500">Loading analysis...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Article Not Found
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          The requested article may have been archived or moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const readingStats = calculateReadingTime(article.content);
  const displayReadingTime = article.readingTime || readingStats.text;

  return (
    <>
      <ReadingProgress />

      {/* Floating Action & Reading Progress Bar */}
      <FloatingActionBar
        title={article.title}
        url={pageUrl}
        totalReadingMinutes={readingStats.minutes}
        liked={liked}
        saved={saved}
        likesCount={likesCount}
        commentsCount={article.commentsCount}
        onLike={handleLike}
        onSave={handleSave}
        onCommentsClick={() => {
          const el = document.getElementById('comments-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            to={`/category/${article.categorySlug}`}
            className="hover:text-neutral-900 dark:hover:text-white font-medium transition"
          >
            {article.categoryName}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="truncate max-w-[200px] text-neutral-700 dark:text-neutral-300">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to={`/category/${article.categorySlug}`}
              className="text-xs font-bold uppercase tracking-wider text-[#635BFF] hover:underline"
            >
              {article.categoryName}
            </Link>
            {article.isSponsored && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                Sponsored by {article.sponsoredBrand || 'Partner'}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="mt-4 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author & Publication Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-b border-neutral-200 dark:border-neutral-800 py-4">
            <div className="flex items-center gap-3">
              {article.authorPhotoURL ? (
                <img
                  src={article.authorPhotoURL}
                  alt={article.authorName}
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-base">
                  {article.authorName.charAt(0)}
                </div>
              )}
              <div>
                <Link
                  to={`/author/${article.authorUsername}`}
                  className="font-bold text-sm text-neutral-900 dark:text-white hover:underline block leading-tight"
                >
                  {article.authorName}
                </Link>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex-wrap">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#635BFF]" />
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{displayReadingTime}</span>
                    {readingStats.words > 0 && (
                      <span className="text-neutral-400">({readingStats.words.toLocaleString()} words)</span>
                    )}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {article.views || 0} reads
                  </span>
                </div>
              </div>
            </div>

            {/* Top Action Controls: Like, Save, Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                aria-label="Like article"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                  liked
                    ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleSave}
                aria-label="Bookmark article"
                className={`p-2 rounded-lg border text-xs transition ${
                  saved
                    ? 'border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>

              <ShareBar title={article.title} url={pageUrl} />
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-10 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Table of Contents */}
        <TableOfContents markdown={article.content} />

        {/* Article Body Typography with Anchor IDs for Headings */}
        <article className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-[#635BFF] prose-a:no-underline hover:prose-a:underline prose-code:font-mono prose-code:text-sm prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-neutral-800">
          <ReactMarkdown
            components={{
              h2: ({ children }) => {
                const text = Array.isArray(children) ? children.join('') : String(children || '');
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return (
                  <h2 id={id} className="scroll-mt-24 font-extrabold text-2xl sm:text-3xl mt-10 mb-4 text-neutral-900 dark:text-white">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const text = Array.isArray(children) ? children.join('') : String(children || '');
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return (
                  <h3 id={id} className="scroll-mt-24 font-bold text-xl sm:text-2xl mt-8 mb-3 text-neutral-900 dark:text-white">
                    {children}
                  </h3>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Reading Insights Section */}
        <ReadingInsights 
          article={article} 
          onUpdateArticle={(updates) => setArticle({ ...article, ...updates })} 
        />

        {/* Social Sharing Banner at End of Article */}
        <div className="my-10 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
              Found this valuable?
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Share this research dispatch across your engineering and AI network.
            </p>
          </div>
          <ShareBar title={article.title} url={pageUrl} showLabel={false} size="md" />
        </div>

        {/* Tags List */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 print:hidden">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 mr-2">
                Tagged in:
              </span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/explore?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-[#635BFF]/10 hover:text-[#635BFF] transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* In-Content / Bottom Monetization Ad */}
        <div className="print:hidden">
          <AdBanner placement="article_incontent" />
        </div>

        {/* Author Signature Card */}
        <div className="my-10 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {article.authorPhotoURL ? (
            <img
              src={article.authorPhotoURL}
              alt={article.authorName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xl shrink-0">
              {article.authorName.charAt(0)}
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                  Written by {article.authorName}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Staff Contributor &amp; AI Research Fellow
                </p>
              </div>
              <Link
                to={`/author/${article.authorUsername}`}
                className="text-xs font-bold text-[#635BFF] hover:underline print:hidden"
              >
                View all articles →
              </Link>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Specializing in autonomous reasoning agents, retrieval pipelines, and distributed machine learning systems at EduAI.
            </p>
          </div>
        </div>

        {/* Reader Comments Section with Anchor ID */}
        <div id="comments-section" className="scroll-mt-20 print:hidden">
          <CommentSection articleId={article.id} articleSlug={article.slug} />
        </div>

        {/* Related Articles Showcase */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-neutral-200 dark:border-neutral-800 print:hidden">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              More in {article.categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ArticleCard key={rel.id} article={rel} layout="standard" />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Call to Action */}
        <div className="print:hidden">
          <NewsletterCta />
        </div>
      </main>

      {/* Save to List Modal */}
      {isSaveModalOpen && (
        <SaveToListModal
          article={article}
          onClose={() => setIsSaveModalOpen(false)}
          onSavedStateChange={setSaved}
        />
      )}
    </>
  );
}

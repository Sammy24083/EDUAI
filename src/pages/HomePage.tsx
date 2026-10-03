import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Layers, Flame, RefreshCw } from 'lucide-react';
import { Article, Category } from '../types';
import { getPublishedArticles, getFeaturedArticle, getTrendingArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';
import { seedDatabase } from '../services/seedService';
import { HeroFeatured } from '../components/article/HeroFeatured';
import { TrendingList } from '../components/article/TrendingList';
import { ArticleCard } from '../components/article/ArticleCard';
import { HomePageSkeleton } from '../components/article/ArticleCardSkeleton';
import { NewsletterCta } from '../components/newsletter/NewsletterCta';
import { NewsletterSignupPopup } from '../components/newsletter/NewsletterSignupPopup';
import { AdBanner } from '../components/ads/AdBanner';
import { useSEO } from '../hooks/useSEO';

export function HomePage() {
  const [featured, setFeatured] = useState<Article | null>(null);
  const [trending, setTrending] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'EduAI — Modern Technology & Artificial Intelligence Publication',
    description: 'In-depth engineering analysis, autonomous agents, neural architectures, web development, and tech startup strategy.',
    type: 'website',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [feat, trend, arts, cats] = await Promise.all([
        getFeaturedArticle(),
        getTrendingArticles(6),
        getPublishedArticles(12),
        getCategories(),
      ]);

      setFeatured(feat || null);
      setTrending(trend);
      setArticles(arts);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.categorySlug === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Newsletter Signup Popup Trigger */}
      <NewsletterSignupPopup delayMs={5000} source="homepage_popup" />

      {/* Editorial Announcement Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 px-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-xs">
        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-[#635BFF] animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[#635BFF]">Special Edition</span>
          <span>•</span>
          <span className="font-medium">The 2026 Autonomous Agent Architectural Report is now published.</span>
        </div>
        <Link
          to="/explore"
          className="font-bold text-neutral-900 dark:text-white hover:text-[#635BFF] flex items-center gap-1 shrink-0"
        >
          Explore All Dispatches <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <HomePageSkeleton />
      ) : (
        <>
          {/* Featured Hero Article */}
          {featured && <HeroFeatured article={featured} />}

          {/* Advertisement Placement: Home Banner */}
          <AdBanner placement="home_banner" />

          {/* Trending Articles Section */}
          {trending.length > 0 && <TrendingList articles={trending} />}

          {/* Topic Navigation Filter Bar */}
          <section className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#635BFF]" />
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Latest Dispatches
                </h2>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === 'all'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  All Topics
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      activeCategory === cat.slug
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
                <p className="text-neutral-500 text-sm">
                  No articles found under this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} layout="standard" />
                ))}
              </div>
            )}
          </section>

          {/* Deep Dive Horizontal Showcase */}
          {articles.length > 3 && (
            <section className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Editorial Deep Dives
                  </h3>
                </div>
                <Link
                  to="/explore"
                  className="text-xs font-bold text-[#635BFF] hover:underline flex items-center gap-1"
                >
                  View Library <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {articles.slice(2, 6).map((art) => (
                  <ArticleCard key={art.id} article={art} layout="horizontal" />
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Section */}
          <NewsletterCta />
        </>
      )}
    </div>
  );
}

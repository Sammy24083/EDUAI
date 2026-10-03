import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Eye, Clock } from 'lucide-react';
import { Article } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { toggleSave } from '../../services/interactionService';
import { formatReadingTime } from '../../utils/readingTime';

interface ArticleCardProps {
  article: Article;
  layout?: 'standard' | 'horizontal' | 'compact';
}

export function ArticleCard({ article, layout = 'standard' }: ArticleCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save articles to your reading list.');
      return;
    }
    setSaving(true);
    try {
      const saved = await toggleSave(article, user.uid);
      setIsSaved(saved);
    } catch (err) {
      console.error('Error saving article:', err);
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  if (layout === 'compact') {
    return (
      <article className="group flex gap-4 items-start py-3 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
        <div className="flex-1 min-w-0">
          <Link
            to={`/category/${article.categorySlug}`}
            className="text-[11px] font-bold uppercase tracking-wider text-[#635BFF] hover:underline"
          >
            {article.categoryName}
          </Link>
          <Link to={`/article/${article.slug}`}>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#635BFF] transition-colors line-clamp-2 mt-0.5">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{article.authorName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#635BFF]" />
              {formatReadingTime(article.readingTime, article.content)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (layout === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
        {article.featuredImage && (
          <Link
            to={`/article/${article.slug}`}
            className="sm:w-52 h-40 rounded-lg overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800"
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
          </Link>
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <Link
                to={`/category/${article.categorySlug}`}
                className="text-xs font-bold uppercase tracking-wider text-[#635BFF]"
              >
                {article.categoryName}
              </Link>
              {article.isSponsored && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                  Sponsored
                </span>
              )}
            </div>

            <Link to={`/article/${article.slug}`}>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#635BFF] transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h3>
            </Link>

            {article.subtitle && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1.5">
                {article.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              {article.authorPhotoURL ? (
                <img
                  src={article.authorPhotoURL}
                  alt={article.authorName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] flex items-center justify-center font-bold">
                  {article.authorName.charAt(0)}
                </div>
              )}
              <Link
                to={`/author/${article.authorUsername}`}
                className="font-medium text-neutral-700 dark:text-neutral-300 hover:underline"
              >
                {article.authorName}
              </Link>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#635BFF]" />
                {formatReadingTime(article.readingTime, article.content)}
              </span>
              <button
                onClick={handleSaveToggle}
                disabled={saving}
                aria-label="Save article"
                className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition ${
                  isSaved ? 'text-[#635BFF]' : 'text-neutral-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article className="group flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      <div>
        {article.featuredImage && (
          <Link
            to={`/article/${article.slug}`}
            className="block aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative"
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
            {article.isSponsored && (
              <span className="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm bg-amber-500 text-white">
                Sponsored
              </span>
            )}
          </Link>
        )}

        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link
              to={`/category/${article.categorySlug}`}
              className="text-xs font-bold uppercase tracking-wider text-[#635BFF] hover:underline"
            >
              {article.categoryName}
            </Link>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views || 0}
            </span>
          </div>

          <Link to={`/article/${article.slug}`}>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-[#635BFF] transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          {article.subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
              {article.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800/70 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          {article.authorPhotoURL ? (
            <img
              src={article.authorPhotoURL}
              alt={article.authorName}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-[10px] flex items-center justify-center font-bold">
              {article.authorName.charAt(0)}
            </div>
          )}
          <Link
            to={`/author/${article.authorUsername}`}
            className="font-medium text-neutral-700 dark:text-neutral-300 hover:underline truncate max-w-[110px]"
          >
            {article.authorName}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-[#635BFF]" />
            {formatReadingTime(article.readingTime, article.content)}
          </span>
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            aria-label="Save article"
            className={`p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition ${
              isSaved ? 'text-[#635BFF]' : 'text-neutral-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}

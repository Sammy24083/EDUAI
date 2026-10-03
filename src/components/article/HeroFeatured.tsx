import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { Article } from '../../types';
import { formatReadingTime } from '../../utils/readingTime';

export function HeroFeatured({ article }: { article: Article }) {
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

  return (
    <section className="relative w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Left / Top: Editorial content */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF]">
                Featured Dispatch
              </span>
              <Link
                to={`/category/${article.categorySlug}`}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white uppercase tracking-wider"
              >
                {article.categoryName}
              </Link>
            </div>

            <Link to={`/article/${article.slug}`} className="group block">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight group-hover:text-[#635BFF] transition-colors">
                {article.title}
              </h1>
            </Link>

            {article.subtitle && (
              <p className="mt-4 text-base text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                {article.subtitle}
              </p>
            )}
          </div>

          <div className="pt-8 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {article.authorPhotoURL ? (
                <img
                  src={article.authorPhotoURL}
                  alt={article.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm">
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
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#635BFF]" />
                    {formatReadingTime(article.readingTime, article.content)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/article/${article.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-xs font-bold transition shadow-sm"
            >
              Read Analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right / Cover Image */}
        <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full bg-neutral-100 dark:bg-neutral-800">
          <Link to={`/article/${article.slug}`} className="block w-full h-full">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 font-medium">
            <Eye className="w-3.5 h-3.5" />
            {article.views || 0} reads
          </div>
        </div>
      </div>
    </section>
  );
}

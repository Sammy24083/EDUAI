import { Link } from 'react-router-dom';
import { TrendingUp, Clock } from 'lucide-react';
import { Article } from '../../types';

export function TrendingList({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
          <TrendingUp className="w-3.5 h-3.5 text-[#635BFF]" />
        </div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white">
          Trending on EduAI
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 6).map((article, idx) => {
          const rankNumber = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={article.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition"
            >
              <span className="text-2xl font-black text-neutral-300 dark:text-neutral-700 select-none font-mono">
                {rankNumber}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/category/${article.categorySlug}`}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#635BFF] hover:underline"
                >
                  {article.categoryName}
                </Link>
                <Link to={`/article/${article.slug}`}>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white hover:text-[#635BFF] transition-colors line-clamp-2 mt-1 leading-snug">
                    {article.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {article.authorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readingTime || '5 min'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

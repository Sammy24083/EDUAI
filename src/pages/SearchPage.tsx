import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { searchArticles } from '../services/articleService';
import { ArticleCard } from '../components/article/ArticleCard';
import { useSEO } from '../hooks/useSEO';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useSEO({
    title: query ? `Search: "${query}"` : 'Search Publication',
    description: 'Search all technical analyses and reports on EduAI.',
  });

  const performSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchArticles(q);
      setResults(res);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query.trim() });
    performSearch(query.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Search EduAI Publication
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Query our full library of foundation models, agents, and software architecture articles.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, model, author, or keyword..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-neutral-400">Popular searches:</span>
          {['Autonomous Agents', 'Vector Search', 'React 19', 'RAG', 'Startups'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                setSearchParams({ q: tag });
                performSearch(tag);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-[#635BFF]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-400">Searching editorial archives...</p>
        </div>
      ) : initialQuery ? (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 text-xs font-semibold text-neutral-500">
            Found {results.length} {results.length === 1 ? 'article' : 'articles'} matching "{initialQuery}"
          </div>
          {results.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
              <p className="text-neutral-500 text-sm">
                No matching dispatches found. Try a different keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((art) => (
                <ArticleCard key={art.id} article={art} layout="standard" />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Article } from '../../types';
import { searchArticles } from '../../services/articleService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setSearching(true);
        try {
          const res = await searchArticles(query.trim());
          setResults(res);
        } catch {
          // ignore
        } finally {
          setSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/article/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI agents, RAG, machine learning, software architecture..."
            autoFocus
            className="w-full py-4 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {searching ? (
            <div className="py-8 text-center text-sm text-neutral-400">
              Searching technical publications...
            </div>
          ) : query && results.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No matching articles found for "{query}". Try searching for 'agents', 'vector', or 'startups'.
            </div>
          ) : results.length > 0 ? (
            results.map((article) => (
              <div
                key={article.id}
                onClick={() => handleSelect(article.slug)}
                className="group flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#635BFF]">
                      {article.categoryName}
                    </span>
                    <span className="text-[10px] text-neutral-400">•</span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readingTime || '5 min'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#635BFF] transition line-clamp-1">
                    {article.title}
                  </h4>
                  {article.subtitle && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {article.subtitle}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#635BFF] group-hover:translate-x-1 transition shrink-0 mt-2" />
              </div>
            ))
          ) : (
            <div className="py-6 px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Suggested Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {['Autonomous Agents', 'Vector Search', 'React 19', 'RAG', 'DSPy', 'Startups', 'Quantization'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

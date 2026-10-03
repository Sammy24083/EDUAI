import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Article, Category, Tag } from '../types';
import { getPublishedArticles } from '../services/articleService';
import { getCategories, getTags } from '../services/categoryService';
import { ArticleCard } from '../components/article/ArticleCard';
import { ArticleCardSkeleton } from '../components/article/ArticleCardSkeleton';
import { useSEO } from '../hooks/useSEO';

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTag = searchParams.get('tag') || '';
  const initialCat = searchParams.get('category') || 'all';

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes'>('newest');
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Explore Library — Articles & Engineering Reports',
    description: 'Browse all articles across artificial intelligence, autonomous agents, web engineering, and startups.',
  });

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [arts, cats, tgs] = await Promise.all([
          getPublishedArticles(50),
          getCategories(),
          getTags(),
        ]);
        setArticles(arts);
        setCategories(cats);
        setTags(tgs);
      } catch (err) {
        console.error('Failed to load explore articles:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (initialTag) setSelectedTag(initialTag);
    if (initialCat) setSelectedCategory(initialCat);
  }, [initialTag, initialCat]);

  const filtered = articles
    .filter((a) => {
      const matchCat = selectedCategory === 'all' || a.categorySlug === selectedCategory;
      const matchTag = !selectedTag || (a.tags && a.tags.includes(selectedTag));
      const matchQuery =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTag && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
      // Newest
      const timeA = new Date(a.publishedAt || a.createdAt).getTime();
      const timeB = new Date(b.publishedAt || b.createdAt).getTime();
      return timeB - timeA;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Explore Library
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Deep-dives, benchmarks, and research dispatches on autonomous intelligence, full-stack systems, and software craftsmanship.
        </p>

        {/* Filter Controls Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword or author..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300 focus:outline-none"
            >
              <option value="all">All Topics</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Tag Filter */}
            {selectedTag && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#635BFF]/10 text-[#635BFF] text-xs font-bold">
                <span>Tag: #{selectedTag}</span>
                <button
                  onClick={() => {
                    setSelectedTag('');
                    setSearchParams({});
                  }}
                  className="hover:opacity-80"
                >
                  ×
                </button>
              </div>
            )}

            {/* Sort Filter */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  sortBy === 'newest'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy('views')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  sortBy === 'views'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setSortBy('likes')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                  sortBy === 'likes'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Most Appreciated
              </button>
            </div>
          </div>
        </div>

        {/* Tags bar */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1">
              Filter by Tag:
            </span>
            {tags.slice(0, 12).map((tg) => (
              <button
                key={tg.id}
                onClick={() => setSelectedTag(selectedTag === tg.name ? '' : tg.name)}
                className={`px-2.5 py-1 rounded-md text-xs transition ${
                  selectedTag === tg.name
                    ? 'bg-[#635BFF] text-white font-bold'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                #{tg.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid or Empty */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} layout="standard" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">
            No articles match your criteria
          </h3>
          <p className="text-sm text-neutral-500">
            Try broadening your search or resetting the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-neutral-400 font-medium">
            Showing {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((art) => (
              <ArticleCard key={art.id} article={art} layout="standard" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

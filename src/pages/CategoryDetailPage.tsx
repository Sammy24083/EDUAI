import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { Article, Category } from '../types';
import { getPublishedArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';
import { ArticleCard } from '../components/article/ArticleCard';
import { useSEO } from '../hooks/useSEO';

export function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      setSelectedTag(null);
      try {
        const [cats, arts] = await Promise.all([
          getCategories(),
          getPublishedArticles(30, slug),
        ]);
        const match = cats.find((c) => c.slug === slug);
        setCategory(match || null);
        setArticles(arts);
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((art) => {
      if (art.tags && Array.isArray(art.tags)) {
        art.tags.forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter((art) => art.tags?.includes(selectedTag));
  }, [articles, selectedTag]);

  useSEO({
    title: category ? `${category.name} Dispatches` : 'Category',
    description: category?.description || 'Browse technology articles in this category.',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/categories" className="hover:underline">Categories</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          {category?.name || slug}
        </span>
      </nav>

      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] block mb-2">
          Category Dispatch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {category?.name || slug}
        </h1>
        {category?.description && (
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

        {/* Tag Cloud Filter */}
        {!loading && availableTags.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              <TagIcon className="w-4 h-4 text-[#635BFF]" />
              Filter by Topic
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedTag === null
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                }`}
              >
                All Topics
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedTag === tag
                      ? 'bg-[#635BFF] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="opacity-50">#</span>{tag}
                </button>
              ))}
            </div>
          </div>
        )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            {selectedTag ? `No articles found for #${selectedTag}` : 'No articles found in this category'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {selectedTag ? 'Try selecting a different topic.' : 'Check back soon for new research reports.'}
          </p>
          <button
            onClick={() => setSelectedTag(null)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#635BFF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="standard" />
          ))}
        </div>
      )}
    </div>
  );
}

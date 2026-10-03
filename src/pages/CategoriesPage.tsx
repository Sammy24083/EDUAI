import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, FolderKanban } from 'lucide-react';
import { Category } from '../types';
import { getCategories } from '../services/categoryService';
import { useSEO } from '../hooks/useSEO';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Editorial Categories & Taxonomy',
    description: 'Explore publication subjects from artificial intelligence and autonomous agents to cloud architecture and venture strategy.',
  });

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Publication Categories
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl">
          Structured technical domains curated by the EduAI editorial board.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-[#635BFF] dark:hover:border-[#635BFF] transition flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: cat.color || '#635BFF' }}
                  >
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    Topic
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#635BFF] transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-[#635BFF]">
                <span>Explore Dispatches</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

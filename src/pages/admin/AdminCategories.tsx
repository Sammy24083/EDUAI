import { useState, useEffect } from 'react';
import { Plus, Trash2, FolderTree, Tag, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import {
  getCategories,
  createCategory,
  deleteCategory,
  getTags,
  createTag,
} from '../../services/categoryService';
import { Category, Tag as TagType } from '../../types';
import { useSEO } from '../../hooks/useSEO';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState('#635BFF');
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useSEO({ title: 'Taxonomy & Categories — EduAI CMS', description: 'Manage publication categories and tags.' });

  const loadTaxonomy = async () => {
    setLoading(true);
    try {
      const [c, t] = await Promise.all([getCategories(), getTags()]);
      setCategories(c);
      setTags(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxonomy();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSubmitting(true);
    try {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await createCategory({
        name: catName.trim(),
        slug,
        description: catDesc.trim(),
        color: catColor,
      });
      setCatName('');
      setCatDesc('');
      await loadTaxonomy();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    try {
      const clean = tagName.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      await createTag({ name: clean, slug: clean });
      setTagName('');
      await loadTaxonomy();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Taxonomy Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure primary publication categories and technical tags.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Categories Manager */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                <FolderTree className="w-4 h-4 text-[#635BFF]" />
                Add New Category
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      required
                      placeholder="e.g. Distributed Systems"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">
                      Theme Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={catColor}
                        onChange={(e) => setCatColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1">
                    Description
                  </label>
                  <textarea
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    rows={2}
                    placeholder="Short description for editorial index..."
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* List of existing categories */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 font-bold text-xs uppercase tracking-wider text-neutral-400">
                Active Categories ({categories.length})
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color || '#635BFF' }}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400">/{cat.slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Manager */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#635BFF]" />
                Add Tag
              </h3>
              <form onSubmit={handleCreateTag} className="flex gap-2">
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g. transformers, rag"
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
                >
                  Add Tag
                </button>
              </form>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400 mb-4">
                Indexed Tags ({tags.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenSquare,
  Trash2,
  Eye,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getAllArticles, deleteArticle, updateArticle } from '../../services/articleService';
import { Article } from '../../types';
import { useSEO } from '../../hooks/useSEO';

export function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Manage Articles — EduAI CMS', description: 'Editorial article management.' });

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await updateArticle(article.id, {
        status: newStatus,
        publishedAt: newStatus === 'published' ? (article.publishedAt || new Date().toISOString()) : undefined,
      });
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id
            ? { ...a, status: newStatus, publishedAt: newStatus === 'published' ? (a.publishedAt || new Date().toISOString()) : undefined }
            : a
        )
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const filtered = articles.filter((a) => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchQuery =
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.authorName.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              Manage Articles ({articles.length})
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Draft, schedule, publish, and edit all editorial dispatches.
            </p>
          </div>

          <Link
            to="/admin/articles/new"
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <PenSquare className="w-3.5 h-3.5" />
            New Article
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Published ({articles.filter((a) => a.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === 'draft'
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Drafts ({articles.filter((a) => a.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-xs text-neutral-400">Loading articles...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-xs text-neutral-400">
              No matching articles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reads</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {filtered.map((art) => (
                    <tr key={art.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-5 max-w-xs font-medium text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/article/${art.slug}`}
                            target="_blank"
                            className="hover:text-[#635BFF] flex items-center gap-1 line-clamp-1"
                          >
                            <span>{art.title}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{art.authorName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-medium whitespace-nowrap">
                          {art.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(art)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:opacity-80 transition ${
                            art.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}
                        >
                          {art.status}
                        </button>
                      </td>
                      <td className="py-3 px-4">{art.views || 0}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                        {new Date(art.publishedAt || art.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-3">
                        <Link
                          to={`/admin/articles/${art.id}`}
                          className="font-bold text-[#635BFF] hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="font-bold text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

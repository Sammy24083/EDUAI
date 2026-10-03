import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Eye,
  Heart,
  Mail,
  PenSquare,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getAllArticles } from '../../services/articleService';
import { getNewsletterSubscribers } from '../../services/newsletterService';
import { seedDatabase } from '../../services/seedService';
import { Article } from '../../types';
import { useSEO } from '../../hooks/useSEO';

export function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  useSEO({ title: 'CMS Overview', description: 'EduAI Editorial Overview' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [allArts, subs] = await Promise.all([
        getAllArticles(),
        getNewsletterSubscribers(),
      ]);
      setArticles(allArts);
      setSubscribersCount(subs.length);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    if (!confirm('Populate/refresh database with editorial sample articles and categories?')) return;
    setSeeding(true);
    try {
      await seedDatabase();
      setSeedSuccess(true);
      await loadData();
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error('Seeding failed:', err);
    } finally {
      setSeeding(false);
    }
  };

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalLikes = articles.reduce((acc, a) => acc + (a.likesCount || 0), 0);
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Publication Overview
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Real-time analytics and editorial operations for EduAI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding Content...' : 'Seed Sample Articles'}
            </button>

            <Link
              to="/admin/articles/new"
              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <PenSquare className="w-3.5 h-3.5" />
              New Article
            </Link>
          </div>
        </div>

        {seedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Database successfully refreshed with sample articles, categories, and advertisements.</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Total Articles</span>
              <FileText className="w-4 h-4 text-[#635BFF]" />
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {articles.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
              <span className="text-emerald-600 font-semibold">{publishedCount} published</span>
              <span>•</span>
              <span>{draftCount} drafts</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Publication Reads</span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Across all published articles</div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Subscribers</span>
              <Mail className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {subscribersCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Weekly dispatch readers</div>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Reader Likes</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {totalLikes.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Community appreciations</div>
          </div>
        </div>

        {/* Recent Articles Table */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Recent Articles
            </h3>
            <Link
              to="/admin/articles"
              className="text-xs font-bold text-[#635BFF] hover:underline"
            >
              View All ({articles.length}) →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400">Loading records...</div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No articles registered. Click "Seed Sample Articles" or write one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reads</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {articles.slice(0, 7).map((art) => (
                    <tr key={art.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-5 font-semibold text-neutral-900 dark:text-white">
                        <Link
                          to={`/article/${art.slug}`}
                          target="_blank"
                          className="hover:text-[#635BFF] flex items-center gap-1.5"
                        >
                          <span className="line-clamp-1">{art.title}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
                          {art.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            art.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{art.views || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/admin/articles/${art.id}`}
                          className="font-bold text-[#635BFF] hover:underline"
                        >
                          Edit
                        </Link>
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

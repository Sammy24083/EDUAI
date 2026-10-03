import { useState, useEffect } from 'react';
import { Mail, Download, Search, CheckCircle2, UserX } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getNewsletterSubscribers, unsubscribeNewsletter } from '../../services/newsletterService';
import { NewsletterSubscriber } from '../../types';
import { useSEO } from '../../hooks/useSEO';

export function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Newsletter Subscribers — EduAI CMS', description: 'Subscriber audience management.' });

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await getNewsletterSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`Unsubscribe ${email}?`)) return;
    try {
      await unsubscribeNewsletter(email);
      setSubscribers((prev) => prev.filter((s) => s.email !== email));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = 'Email,Source,SubscribedAt,Status\n';
    const rows = subscribers
      .map((s) => `"${s.email}","${s.source}","${s.subscribedAt}","${s.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduai-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              Newsletter Audience ({subscribers.length})
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Subscribers to the EduAI Weekly Dispatch.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-xs text-neutral-400">Loading subscribers...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-xs text-neutral-400">
              No matching subscribers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-5">Email</th>
                    <th className="py-3 px-4">Origin Source</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {filtered.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-5 font-semibold text-neutral-900 dark:text-white">
                        {sub.email}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                        {sub.source}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleUnsubscribe(sub.email)}
                          className="font-bold text-red-600 dark:text-red-400 hover:underline"
                        >
                          Remove
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

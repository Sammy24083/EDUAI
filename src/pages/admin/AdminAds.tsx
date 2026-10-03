import { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, ExternalLink, Eye, MousePointer } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getAllAdsForAdmin, createAd, updateAd, deleteAd } from '../../services/adService';
import { Advertisement, AdPlacement } from '../../types';
import { useSEO } from '../../hooks/useSEO';

export function AdminAds() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [title, setTitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('home_banner');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useSEO({ title: 'Monetization & Ads — EduAI CMS', description: 'Manage commercial banners and sponsor integrations.' });

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await getAllAdsForAdmin();
      setAds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destinationUrl.trim()) return;
    setSubmitting(true);
    try {
      await createAd({
        title: title.trim(),
        destinationUrl: destinationUrl.trim(),
        imageUrl: imageUrl.trim() || undefined,
        placement,
        active: true,
        isActive: true,
      });
      setTitle('');
      setDestinationUrl('');
      setImageUrl('');
      await loadAds();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (ad: Advertisement) => {
    try {
      await updateAd(ad.id, { isActive: !ad.isActive });
      setAds((prev) =>
        prev.map((a) => (a.id === ad.id ? { ...a, isActive: !a.isActive } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete advertisement "${title}"?`)) return;
    try {
      await deleteAd(id);
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Monetization &amp; Advertisements
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage partner banners, sponsored units, and track impressions and clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create Ad Form */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-[#635BFF]" />
                Create Sponsor Placement
              </h3>

              <form onSubmit={handleCreateAd} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Campaign / Sponsor Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Pinecone Serverless Vector Search"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    required
                    placeholder="https://partner.com/?ref=eduai"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Banner Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    Placement Location
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="home_banner">Home Page Banner</option>
                    <option value="article_incontent">Article In-Content Banner</option>
                    <option value="article_top">Article Header Banner</option>
                    <option value="sidebar">Sidebar Placement</option>
                    <option value="footer">Footer Banner</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition disabled:opacity-50"
                >
                  Publish Campaign Banner
                </button>
              </form>
            </div>
          </div>

          {/* Active Ads List */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 font-bold text-xs uppercase tracking-wider text-neutral-400">
                Registered Placements ({ads.length})
              </div>

              {loading ? (
                <div className="py-20 text-center text-xs text-neutral-400">Loading campaigns...</div>
              ) : ads.length === 0 ? (
                <div className="py-20 text-center text-xs text-neutral-400">
                  No ad campaigns configured.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {ads.map((ad) => (
                    <div key={ad.id} className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {ad.imageUrl && (
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="w-14 h-10 object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {ad.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                            <span className="font-mono">{ad.placement}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MousePointer className="w-2.5 h-2.5" />
                              {ad.clicks || 0} clicks
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleToggleActive(ad)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                            ad.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                          }`}
                        >
                          {ad.isActive ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id, ad.title)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

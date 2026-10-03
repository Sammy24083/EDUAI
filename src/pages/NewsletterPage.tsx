import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Inbox } from 'lucide-react';
import { subscribeNewsletter } from '../services/newsletterService';
import { useSEO } from '../hooks/useSEO';

export function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useSEO({
    title: 'The EduAI Weekly Dispatch — Newsletter',
    description: 'Subscribe to our Saturday morning breakdown of cutting-edge AI breakthroughs, model weights, and distributed systems.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await subscribeNewsletter(email, 'dedicated_page');
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Subscription failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-bold uppercase tracking-wider">
          <Inbox className="w-3.5 h-3.5" />
          The Weekly Dispatch
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          Signal Over Noise in Artificial Intelligence
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Every Saturday morning, we deliver a concise, engineering-grade synthesis of new papers, open-weight architectures, and autonomous agent systems.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email..."
            required
            className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-sm font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Join 25,000+'}
          </button>
        </form>

        {status && (
          <div
            className={`mt-4 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${
              status.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </div>

      {/* What you'll get */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
            1. Paper Teardowns
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            We read arXiv so you don't have to. Key architectural changes explained in clear diagrams and bullet points.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
            2. Production Benchmarks
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Real latency, cost-per-million tokens, context retention evaluations, and hardware scaling metrics.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
            3. Open Source Releases
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Curated GitHub repositories, quantized weights on Hugging Face, and developer tooling announcements.
          </p>
        </div>
      </div>
    </div>
  );
}

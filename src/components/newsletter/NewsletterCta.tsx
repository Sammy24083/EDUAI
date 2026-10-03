import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../../services/newsletterService';

export function NewsletterCta() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await subscribeNewsletter(email, 'inline_editorial_cta');
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to complete subscription. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-14 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
      <div className="w-12 h-12 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center mx-auto mb-4">
        <Mail className="w-6 h-6" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
        Stay ahead of the AI curve.
      </h2>
      <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
        Join 25,000+ AI engineers, founders, and software architects receiving our curated weekly analysis of foundation models, agentic systems, and research breakthroughs.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email..."
          required
          className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-sm font-bold transition flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe Free'}
          <ArrowRight className="w-4 h-4" />
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

      <p className="mt-4 text-[11px] text-neutral-400 dark:text-neutral-500">
        No spam, ever. Unsubscribe with one click anytime.
      </p>
    </section>
  );
}

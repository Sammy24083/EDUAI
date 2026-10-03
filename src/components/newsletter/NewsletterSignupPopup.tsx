import { useState, useEffect, useRef } from 'react';
import { Mail, X, CheckCircle2, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { subscribeNewsletter } from '../../services/newsletterService';

interface NewsletterSignupPopupProps {
  delayMs?: number;
  source?: string;
  storageKey?: string;
  cooldownDays?: number;
  forceOpen?: boolean;
  onClose?: () => void;
}

export function NewsletterSignupPopup({
  delayMs = 6000,
  source = 'homepage_popup',
  storageKey = 'eduai_newsletter_popup_dismissed',
  cooldownDays = 7,
  forceOpen = false,
  onClose,
}: NewsletterSignupPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if popup should open after delayMs
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Check if already subscribed
    const isSubscribed = localStorage.getItem('eduai_newsletter_subscribed');
    if (isSubscribed === 'true') {
      return;
    }

    // Check dismissal cooldown
    const dismissedAt = localStorage.getItem(storageKey);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < cooldownMs) {
        return;
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, storageKey, cooldownDays, forceOpen]);

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen) {
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(storageKey, Date.now().toString());
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await subscribeNewsletter(email, source);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        localStorage.setItem('eduai_newsletter_subscribed', 'true');
        setEmail('');
        // Close modal gracefully after 2.5 seconds
        setTimeout(() => {
          setIsOpen(false);
          if (onClose) onClose();
        }, 2500);
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to complete subscription. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      {/* Modal Dialog Content */}
      <div
        id="newsletter-signup-popup"
        className="relative w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden z-10 transition-all transform animate-in zoom-in-95 duration-200"
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#635BFF] via-[#7B73FF] to-purple-500" />

        {/* Close Button */}
        <button
          id="newsletter-popup-close-btn"
          onClick={handleDismiss}
          aria-label="Close newsletter popup"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Icon & Tag */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
              Weekly Intelligence Briefing
            </span>
          </div>

          <h3
            id="newsletter-popup-title"
            className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-snug"
          >
            Stay ahead of autonomous AI & neural breakthroughs
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Join <span className="font-semibold text-neutral-900 dark:text-neutral-200">25,000+ engineers, researchers, and founders</span> who receive our curated weekly breakdowns of LLM benchmarks, agent architectures, and tech strategy.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label htmlFor="newsletter-popup-email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="newsletter-popup-email"
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email address..."
                  required
                  disabled={loading || status?.type === 'success'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:bg-white dark:focus:bg-neutral-900 transition disabled:opacity-50"
                />
              </div>
            </div>

            <button
              id="newsletter-popup-submit-btn"
              type="submit"
              disabled={loading || status?.type === 'success'}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Subscribing...</span>
              ) : status?.type === 'success' ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Subscribed!
                </span>
              ) : (
                <>
                  <span>Join the Newsletter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div
              className={`mt-4 flex items-center gap-2 text-xs p-2.5 rounded-lg ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Social Proof and Guarantee Footnote */}
          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              No spam. Unsubscribe anytime.
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="hover:text-neutral-700 dark:hover:text-neutral-300 underline underline-offset-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

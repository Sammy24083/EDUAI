import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rss, Twitter, Github, Linkedin, ShieldCheck, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { subscribeNewsletter } from '../../services/newsletterService';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await subscribeNewsletter(email, 'footer_cta');
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to complete subscription.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black tracking-tighter text-base">
                E
              </div>
              <span className="font-extrabold tracking-tight text-xl text-neutral-900 dark:text-white">
                Edu<span className="text-[#635BFF] ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              EduAI is a premier technology and artificial intelligence publication documenting the frontier of autonomous agents, neural architectures, distributed software engineering, and AI-first startups.
            </p>
            <div className="flex items-center gap-3 pt-2 text-neutral-500 dark:text-neutral-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <Link
                to="/newsletter"
                aria-label="Newsletter"
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 3: Editorial Focus */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-900 dark:text-white mb-4">
              Editorial Topics
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/category/artificial-intelligence" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/category/ai-engineering" className="hover:text-neutral-900 dark:hover:text-white transition">
                  AI Engineering
                </Link>
              </li>
              <li>
                <Link to="/category/ai-agents" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Autonomous Agents
                </Link>
              </li>
              <li>
                <Link to="/category/software-engineering" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Software Systems
                </Link>
              </li>
              <li>
                <Link to="/category/startups" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Startups &amp; Venture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Community */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-900 dark:text-white mb-4">
              Publication
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/explore" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Explore Library
                </Link>
              </li>
              <li>
                <Link to="/authors" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Contributors &amp; Authors
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Weekly Dispatch
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Editorial Manifesto
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Press &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Compliance */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-900 dark:text-white mb-4">
              Governance
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Firebase Protected
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white flex items-center justify-center lg:justify-start gap-2.5">
              <Mail className="w-5 h-5 text-[#635BFF]" />
              Subscribe to our Newsletter
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Join our community and get the latest insights on AI engineering, autonomous agents, and startups delivered weekly.
            </p>
          </div>
          <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-sm font-bold transition flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {status && (
              <div
                className={`mt-3 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                  status.type === 'success'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                    : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
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
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} EduAI Media. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
            <span>•</span>
            <Link to="/newsletter" className="hover:underline">
              RSS Feeds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

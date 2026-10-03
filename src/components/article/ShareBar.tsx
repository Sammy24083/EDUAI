import { useState, useEffect } from 'react';
import {
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Check,
  Share2,
  MessageCircle,
  X,
  ExternalLink,
} from 'lucide-react';

interface ShareBarProps {
  title: string;
  url: string;
  summary?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ShareBar({
  title,
  url,
  summary,
  showLabel = true,
  size = 'md',
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setSupportsNativeShare(true);
    }
  }, []);

  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedSummary = encodeURIComponent(summary || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = pageUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: pageUrl,
        });
      } catch (err: unknown) {
        // User canceled or failed
        if ((err as Error)?.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const buttonSizeClass =
    size === 'sm'
      ? 'p-1.5 text-xs'
      : size === 'lg'
      ? 'p-2.5 text-sm'
      : 'p-2 text-xs';

  const iconSizeClass =
    size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4';

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {showLabel && (
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 mr-1 hidden sm:inline">
            Share:
          </span>
        )}

        {/* Native Mobile Share Button */}
        {supportsNativeShare && (
          <button
            onClick={handleNativeShare}
            aria-label="Share article via device options"
            className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-[#635BFF] hover:border-[#635BFF]/40 transition flex items-center gap-1 font-semibold`}
            title="Share via device menu"
          >
            <Share2 className={iconSizeClass} />
            <span className="hidden md:inline text-[11px]">Share</span>
          </button>
        )}

        {/* X / Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X / Twitter"
          className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#635BFF] hover:border-neutral-300 dark:hover:border-neutral-700 transition`}
          title="Share on X (Twitter)"
        >
          <Twitter className={iconSizeClass} />
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#0a66c2] hover:border-neutral-300 dark:hover:border-neutral-700 transition`}
          title="Share on LinkedIn"
        >
          <Linkedin className={iconSizeClass} />
        </a>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 hover:border-neutral-300 dark:hover:border-neutral-700 transition`}
          title="Share on WhatsApp"
        >
          <MessageCircle className={iconSizeClass} />
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#1877f2] hover:border-neutral-300 dark:hover:border-neutral-700 transition hidden sm:flex`}
          title="Share on Facebook"
        >
          <Facebook className={iconSizeClass} />
        </a>

        {/* Reddit */}
        <a
          href={shareLinks.reddit}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Reddit"
          className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#ff4500] hover:border-neutral-300 dark:hover:border-neutral-700 transition hidden md:flex`}
          title="Share on Reddit"
        >
          <svg className={iconSizeClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          aria-label="Copy article link"
          className={`${buttonSizeClass} rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition flex items-center gap-1.5`}
          title="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check className={`${iconSizeClass} text-emerald-500`} />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                Copied
              </span>
            </>
          ) : (
            <>
              <Link2 className={iconSizeClass} />
              <span className="hidden sm:inline text-[11px] font-semibold">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Share Modal Dialog fallback */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#635BFF]" />
                Share this Dispatch
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5 line-clamp-2">
              {title}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#635BFF] flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#635BFF] transition"
              >
                <Twitter className="w-4 h-4 text-[#635BFF]" />
                <span>X / Twitter</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#0a66c2] flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#0a66c2] transition"
              >
                <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                <span>LinkedIn</span>
              </a>

              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#1877f2] flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#1877f2] transition"
              >
                <Facebook className="w-4 h-4 text-[#1877f2]" />
                <span>Facebook</span>
              </a>

              <a
                href={shareLinks.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#ff4500] flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-[#ff4500] transition"
              >
                <span className="text-[#ff4500] font-black text-sm">r/</span>
                <span>Reddit</span>
              </a>

              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-sky-500 flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-sky-500 transition"
              >
                <ExternalLink className="w-4 h-4 text-sky-500" />
                <span>Telegram</span>
              </a>
            </div>

            {/* Direct Link Input with One-Click Copy */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <input
                type="text"
                readOnly
                value={pageUrl}
                className="bg-transparent text-xs text-neutral-700 dark:text-neutral-300 flex-1 outline-none truncate px-2 select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#635BFF] text-white text-xs font-bold hover:bg-[#5248e5] transition flex items-center gap-1 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

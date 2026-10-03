import { useState, useEffect } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  ArrowUp,
  Clock,
  Twitter,
  Linkedin,
  MessageCircle,
  Link2,
  Check,
  Facebook,
} from 'lucide-react';
import { getRemainingReadingTime } from '../../utils/readingTime';

interface FloatingActionBarProps {
  title: string;
  url: string;
  totalReadingMinutes: number;
  liked: boolean;
  saved: boolean;
  likesCount: number;
  commentsCount?: number;
  onLike: () => void;
  onSave: () => void;
  onCommentsClick?: () => void;
}

export function FloatingActionBar({
  title,
  url,
  totalReadingMinutes,
  liked,
  saved,
  likesCount,
  commentsCount,
  onLike,
  onSave,
  onCommentsClick,
}: FloatingActionBarProps) {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Show floating bar once scrolled past 300px and hide near absolute bottom
      if (scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        setShareOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(pageUrl);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = pageUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: pageUrl,
        });
        return;
      } catch {
        // Fallback to popover
      }
    }
    setShareOpen(!shareOpen);
  };

  if (!visible) return null;

  const remainingText = getRemainingReadingTime(scrollProgress, totalReadingMinutes);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {/* Social Share Popover */}
      {shareOpen && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-3 flex items-center gap-2 whitespace-nowrap z-50">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#635BFF] transition"
            title="Share on X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#0a66c2] transition"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 transition"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#1877f2] transition"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition flex items-center gap-1 text-xs"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
            {copied && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>}
          </button>
        </div>
      )}

      {/* Main Floating Pill Dock */}
      <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800/90 shadow-xl shadow-neutral-950/10 dark:shadow-black/50 text-neutral-800 dark:text-neutral-200">
        {/* Reading Progress & Time Remaining */}
        <div className="flex items-center gap-2 pr-2 border-r border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-500 dark:text-neutral-400 shrink-0">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-200 dark:text-neutral-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#635BFF] transition-all duration-100"
                strokeDasharray={`${Math.round(scrollProgress)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Clock className="w-2.5 h-2.5 absolute text-[#635BFF]" />
          </div>
          <span className="hidden sm:inline text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            {remainingText}
          </span>
          <span className="sm:hidden text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
            {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={onLike}
          aria-label="Like article"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition ${
            liked
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
          title="Applaud dispatch"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>

        {/* Bookmark / Save Button */}
        <button
          onClick={onSave}
          aria-label="Bookmark article"
          className={`p-2 rounded-full text-xs font-semibold transition ${
            saved
              ? 'text-[#635BFF] bg-[#635BFF]/10'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
          title={saved ? 'Saved in reading list' : 'Save to reading list'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Share Button with Trigger */}
        <button
          onClick={handleNativeShare}
          aria-label="Share article"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition ${
            shareOpen
              ? 'bg-[#635BFF] text-white'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
          title="Share to social networks"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">Share</span>
        </button>

        {/* Comments Shortcut */}
        {onCommentsClick && (
          <button
            onClick={onCommentsClick}
            aria-label="Jump to discussion"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition"
            title="Read comments"
          >
            <MessageSquare className="w-4 h-4" />
            {commentsCount !== undefined && commentsCount > 0 && (
              <span className="text-[11px]">{commentsCount}</span>
            )}
          </button>
        )}

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

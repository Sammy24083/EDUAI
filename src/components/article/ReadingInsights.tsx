import { useState, useEffect } from 'react';
import { Star, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Article } from '../../types';
import { 
  hasUserCompleted, 
  markArticleCompleted, 
  getUserArticleRating, 
  submitArticleRating 
} from '../../services/interactionService';
import { Link } from 'react-router-dom';

interface ReadingInsightsProps {
  article: Article;
  onUpdateArticle: (updates: Partial<Article>) => void;
}

export function ReadingInsights({ article, onUpdateArticle }: ReadingInsightsProps) {
  const { user } = useAuth();
  
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        hasUserCompleted(article.id, user.uid),
        getUserArticleRating(article.id, user.uid)
      ]).then(([isCompleted, userRating]) => {
        setCompleted(isCompleted);
        setRating(userRating);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, article.id]);

  const handleComplete = async () => {
    if (!user || completed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await markArticleCompleted(article, user.uid);
      if (success) {
        setCompleted(true);
        onUpdateArticle({ completionsCount: (article.completionsCount || 0) + 1 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRate = async (value: number) => {
    if (!user || rating !== null || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await submitArticleRating(article, user.uid, value);
      if (success) {
        setRating(value);
        const currentCount = article.ratingsCount || 0;
        const currentAvg = article.averageRating || 0;
        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + value) / newCount;
        onUpdateArticle({ ratingsCount: newCount, averageRating: newAvg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = article.averageRating ? article.averageRating.toFixed(1) : 'No ratings yet';
  const completions = article.completionsCount || 0;

  return (
    <div className="my-10 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-8 print:hidden">
      
      {/* Left side: Stats & Info */}
      <div className="flex-1 w-full text-center sm:text-left">
        <h4 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-[#635BFF]" />
          Reading Insights
        </h4>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Join the community of readers who have completed this technical deep dive.
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-8">
          <div className="text-center sm:text-left">
            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {completions}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-1">
              Completions
            </div>
          </div>
          <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
          <div className="text-center sm:text-left">
            <div className="text-2xl font-black text-neutral-900 dark:text-white flex items-center justify-center sm:justify-start gap-1">
              {displayRating}
              {article.averageRating && <Star className="w-4 h-4 fill-amber-400 text-amber-400 -mt-1" />}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mt-1">
              Average Rating
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Interactive Actions */}
      <div className="flex-1 w-full flex flex-col justify-center gap-4 bg-neutral-50 dark:bg-neutral-950/50 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        {!user ? (
          <div className="text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Sign in to rate and mark as completed.
            </p>
            <Link
              to="/login"
              className="inline-flex px-4 py-2 text-xs font-bold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 transition hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white"
            >
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center p-4">
            <div className="w-5 h-5 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <button
              onClick={handleComplete}
              disabled={completed || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition ${
                completed 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-default'
                  : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white disabled:opacity-50'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${completed ? 'fill-current' : ''}`} />
              {completed ? 'Marked as Completed' : 'Mark as Completed'}
            </button>

            <div className="pt-2">
              <div className="text-xs font-bold text-neutral-500 text-center mb-2">
                {rating ? 'Your Rating' : 'Rate this Article'}
              </div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={rating !== null || isSubmitting}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 disabled:cursor-default focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-all ${
                        (hoverRating >= star || (rating && rating >= star))
                          ? 'fill-amber-400 text-amber-400 scale-110'
                          : 'text-neutral-300 dark:text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

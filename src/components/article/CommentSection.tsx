import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2, Send, ShieldAlert } from 'lucide-react';
import { Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getCommentsForArticle, addComment, deleteComment } from '../../services/commentService';

interface CommentSectionProps {
  articleId: string;
  articleSlug: string;
}

export function CommentSection({ articleId, articleSlug }: CommentSectionProps) {
  const { user, profile, isEditor } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getCommentsForArticle(articleId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to join the conversation.');
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await addComment({
        articleId,
        articleSlug,
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Reader',
        userAvatar: profile?.photoURL || user.photoURL || undefined,
        content: content.trim(),
      });
      setContent('');
      await fetchComments();
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId, articleId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#635BFF]" />
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Input box */}
      {user ? (
        <form onSubmit={handlePost} className="mb-8">
          <div className="flex items-start gap-3">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-9 h-9 rounded-full object-cover shrink-0 mt-1"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Share your perspective or ask a technical question..."
                required
                maxLength={2000}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-neutral-400">
                  Markdown formatting supported • {2000 - content.length} chars left
                </span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-center mb-8 bg-neutral-50 dark:bg-neutral-900/30">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            Sign in to join the conversation and share insights with the EduAI engineering community.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="space-y-4 py-4">
          <div className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg" />
          <div className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 text-sm">
          No comments yet. Be the first to start the discussion!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const canDelete = user && (user.uid === comment.userId || isEditor);
            return (
              <div
                key={comment.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-xs">
                        {comment.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {comment.userName}
                      </span>
                      <span className="text-[11px] text-neutral-400 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      aria-label="Delete comment"
                      className="p-1 rounded text-neutral-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed pl-9">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

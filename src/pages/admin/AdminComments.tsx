import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { getAllCommentsForAdmin, deleteComment } from '../../services/commentService';
import { Comment } from '../../types';
import { useSEO } from '../../hooks/useSEO';

export function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Moderate Comments — EduAI CMS', description: 'Review and moderate reader discussion.' });

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await getAllCommentsForAdmin();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDelete = async (id: string, articleId: string) => {
    if (!confirm('Permanently delete this comment?')) return;
    try {
      await deleteComment(id, articleId);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Comment Moderation ({comments.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Maintain high-signal technical discourse across all published articles.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-xs text-neutral-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="py-20 text-center text-xs text-neutral-400">
              No comments awaiting review.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {comments.map((comment) => (
                <div key={comment.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {comment.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white">
                          {comment.userName}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/article/${comment.articleSlug}`}
                          target="_blank"
                          className="text-[11px] text-[#635BFF] hover:underline flex items-center gap-0.5 ml-2"
                        >
                          View Article <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-2 leading-relaxed whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(comment.id, comment.articleId)}
                    className="p-1 text-neutral-400 hover:text-red-600 transition"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

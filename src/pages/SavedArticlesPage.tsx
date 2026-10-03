import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Folder, ArrowRight, Plus, FolderOpen, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserSavedArticles } from '../services/interactionService';
import { getUserReadingLists, createReadingList, deleteReadingList, removeArticleFromList } from '../services/readingListService';
import { SaveRecord, ReadingList } from '../types';
import { useSEO } from '../hooks/useSEO';

export function SavedArticlesPage() {
  const { user } = useAuth();
  const [saves, setSaves] = useState<SaveRecord[]>([]);
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeListId, setActiveListId] = useState<string | null>(null); // null = Read Later (default)
  
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useSEO({ title: 'Saved Articles & Collections', description: 'Your bookmarked articles on EduAI.' });

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedSaves, fetchedLists] = await Promise.all([
        getUserSavedArticles(user.uid),
        getUserReadingLists(user.uid)
      ]);
      setSaves(fetchedSaves || []);
      setLists(fetchedLists || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newListName.trim()) return;
    setIsSubmitting(true);
    try {
      const newList = await createReadingList(user.uid, newListName.trim());
      setLists([newList, ...lists]);
      setNewListName('');
      setIsCreatingList(false);
      setActiveListId(newList.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list? Saved articles within it will be removed from this list.')) return;
    try {
      await deleteReadingList(listId);
      setLists(lists.filter(l => l.id !== listId));
      setSaves(saves.filter(s => s.listId !== listId));
      if (activeListId === listId) setActiveListId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveArticle = async (articleId: string, listId?: string) => {
    if (!user) return;
    try {
      const success = await removeArticleFromList(articleId, user.uid, listId);
      if (success) {
        setSaves(saves.filter(s => !(s.articleId === articleId && s.listId === listId)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Sign in Required</h2>
        <p className="text-xs text-neutral-500 mb-6">Please sign in to access your saved reading lists.</p>
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const displayedSaves = saves.filter(s => s.listId === activeListId || (activeListId === null && !s.listId));
  const activeList = activeListId ? lists.find(l => l.id === activeListId) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 px-3">Your Library</h2>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveListId(null)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeListId === null
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <Bookmark className="w-4 h-4" /> Read Later
            </button>
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 px-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Collections</h2>
            <button
              onClick={() => setIsCreatingList(true)}
              className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition"
              title="New List"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isCreatingList && (
            <form onSubmit={handleCreateList} className="mb-3 px-3 space-y-2">
              <input
                type="text"
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                className="w-full px-3 py-1.5 text-sm rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-[#635BFF] dark:text-white placeholder-neutral-400"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreatingList(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim() || isSubmitting}
                  className="text-xs font-bold text-[#635BFF] disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <nav className="flex flex-col gap-1">
            {lists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeListId === list.id
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Folder className="w-4 h-4 shrink-0" />
                  <span className="truncate">{list.name}</span>
                </span>
              </button>
            ))}
            {lists.length === 0 && !isCreatingList && (
              <p className="text-xs text-neutral-400 px-3 py-2 italic">No collections yet.</p>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
              {activeList ? (
                <FolderOpen className="w-6 h-6 text-[#635BFF]" />
              ) : (
                <Bookmark className="w-6 h-6 text-[#635BFF]" />
              )}
              {activeList ? activeList.name : 'Read Later'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {activeList ? 'Custom reading collection' : 'Articles bookmarked for offline study and reference'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {activeList && (
              <button
                onClick={() => handleDeleteList(activeList.id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete List
              </button>
            )}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              {displayedSaves.length} {displayedSaves.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : displayedSaves.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
            {activeList ? (
              <FolderOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            ) : (
              <Bookmark className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            )}
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
              This list is empty
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {activeList 
                ? 'Save articles to this collection from the article page.' 
                : 'Click the bookmark icon on any article to save it here for later.'}
            </p>
            <Link
              to="/explore"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold"
            >
              Explore Library <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedSaves.map((save) => (
              <div
                key={save.id}
                className="group p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {save.articleImage && (
                  <img
                    src={save.articleImage}
                    alt={save.articleTitle}
                    className="w-full sm:w-28 h-20 object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/article/${save.articleSlug}`}>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-[#635BFF] transition-colors line-clamp-1">
                      {save.articleTitle}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                    <span>Saved on {new Date(save.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => handleRemoveArticle(save.articleId, save.listId)}
                    className="text-xs text-neutral-400 hover:text-red-500 font-medium transition flex items-center gap-1 self-end sm:self-auto"
                    title="Remove from list"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/article/${save.articleSlug}`}
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold bg-[#635BFF] text-white px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition w-full sm:w-auto"
                  >
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

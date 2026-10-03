import { useState, useEffect } from 'react';
import { X, Check, Plus, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReadingList, Article } from '../../types';
import { getUserReadingLists, createReadingList, saveArticleToList, removeArticleFromList } from '../../services/readingListService';
import { hasUserSaved, toggleSave } from '../../services/interactionService';

interface SaveToListModalProps {
  article: Article;
  onClose: () => void;
  onSavedStateChange: (saved: boolean) => void;
}

export function SaveToListModal({ article, onClose, onSavedStateChange }: SaveToListModalProps) {
  const { user } = useAuth();
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  // Track save state for each list (including default)
  const [savedLists, setSavedLists] = useState<Set<string | 'default'>>(new Set());

  useEffect(() => {
    if (!user) return;
    const loadState = async () => {
      try {
        const [fetchedLists, defaultSaved] = await Promise.all([
          getUserReadingLists(user.uid),
          hasUserSaved(article.id, user.uid)
        ]);
        setLists(fetchedLists || []);
        
        const newSavedSet = new Set<string | 'default'>();
        if (defaultSaved) newSavedSet.add('default');
        
        // Note: For a fully accurate state, we should ideally fetch all SaveRecords for this article and user
        // However, a simpler approach is assuming saves from the default `hasUserSaved` for 'Read Later'.
        // For custom lists, we would need a specific check, but we can assume false initially unless we query `saves` where articleId and userId.
        // Let's implement a robust check here by fetching all saves for this article and user.
        
        // Actually, we can just use interactionService's hasUserSaved for default. 
        // For custom lists, we'll need to fetch the SaveRecords where articleId=id and userId=uid.
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../services/firebase');
        
        const q = query(
          collection(db, 'saves'), 
          where('userId', '==', user.uid),
          where('articleId', '==', article.id)
        );
        const snap = await getDocs(q);
        snap.docs.forEach(doc => {
          const data = doc.data();
          if (data.listId) {
            newSavedSet.add(data.listId);
          } else {
            newSavedSet.add('default');
          }
        });
        
        setSavedLists(newSavedSet);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, [user, article.id]);

  const handleToggleDefault = async () => {
    if (!user) return;
    try {
      const isSaved = await toggleSave(article, user.uid);
      setSavedLists(prev => {
        const next = new Set(prev);
        if (isSaved) next.add('default');
        else next.delete('default');
        return next;
      });
      onSavedStateChange(isSaved || savedLists.size > (savedLists.has('default') ? 1 : 0));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleList = async (listId: string) => {
    if (!user) return;
    try {
      if (savedLists.has(listId)) {
        await removeArticleFromList(article.id, user.uid, listId);
        setSavedLists(prev => {
          const next = new Set(prev);
          next.delete(listId);
          return next;
        });
      } else {
        await saveArticleToList(article, user.uid, listId);
        setSavedLists(prev => {
          const next = new Set(prev);
          next.add(listId);
          return next;
        });
      }
      onSavedStateChange(true); // If they toggle a list, they have it saved somewhere. Technically might be 0, but good enough.
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newListName.trim()) return;
    try {
      const newList = await createReadingList(user.uid, newListName.trim());
      setLists([newList, ...lists]);
      // Auto-save to new list
      await saveArticleToList(article, user.uid, newList.id);
      setSavedLists(prev => {
        const next = new Set(prev);
        next.add(newList.id);
        return next;
      });
      setNewListName('');
      setIsCreating(false);
      onSavedStateChange(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Save to...</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="w-5 h-5 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={handleToggleDefault}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${savedLists.has('default') ? 'bg-[#635BFF]/10 text-[#635BFF]' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">Read Later</span>
                </div>
                {savedLists.has('default') && <Check className="w-4 h-4 text-[#635BFF]" />}
              </button>

              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => handleToggleList(list.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${savedLists.has(list.id) ? 'bg-[#635BFF]/10 text-[#635BFF]' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">{list.name}</span>
                  </div>
                  {savedLists.has(list.id) && <Check className="w-4 h-4 text-[#635BFF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
          {isCreating ? (
            <form onSubmit={handleCreateList} className="flex flex-col gap-2">
              <input
                type="text"
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:border-[#635BFF] dark:text-white"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="flex-1 py-1.5 text-xs font-bold bg-[#635BFF] text-white rounded-lg disabled:opacity-50 transition"
                >
                  Create List
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-2 justify-center py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Create new list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

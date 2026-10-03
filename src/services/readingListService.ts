import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ReadingList, SaveRecord, Article } from '../types';

const LISTS_COL = 'readingLists';
const SAVES_COL = 'saves';
const ARTICLES_COL = 'articles';
import { increment } from 'firebase/firestore';

// --- Reading Lists ---

export async function getUserReadingLists(userId: string): Promise<ReadingList[]> {
  try {
    const colRef = collection(db, LISTS_COL);
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ReadingList)).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, LISTS_COL);
  }
}

export async function createReadingList(userId: string, name: string, description: string = '', isPrivate: boolean = true): Promise<ReadingList> {
  try {
    const colRef = collection(db, LISTS_COL);
    const docRef = doc(colRef);
    const now = new Date().toISOString();
    const payload: Omit<ReadingList, 'id'> = {
      userId,
      name,
      description,
      isPrivate,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(docRef, payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, LISTS_COL);
  }
}

export async function updateReadingList(listId: string, updates: Partial<Omit<ReadingList, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
  try {
    const docRef = doc(db, LISTS_COL, listId);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, LISTS_COL);
  }
}

export async function deleteReadingList(listId: string): Promise<void> {
  try {
    // Delete all saves associated with this list
    const savesQ = query(collection(db, SAVES_COL), where('listId', '==', listId));
    const savesSnap = await getDocs(savesQ);
    const deletePromises = savesSnap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // Delete the list itself
    await deleteDoc(doc(db, LISTS_COL, listId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, LISTS_COL);
  }
}

// --- Save to List ---

export async function saveArticleToList(article: Article, userId: string, listId?: string): Promise<boolean> {
  // If listId is provided, we allow multiple saves (one per list + one for default)
  // To keep keys unique, we use `${article.id}_${userId}_${listId || 'default'}`
  const saveDocId = `${article.id}_${userId}_${listId || 'default'}`;
  const saveRef = doc(db, SAVES_COL, saveDocId);
  const articleRef = doc(db, ARTICLES_COL, article.id);

  try {
    const snap = await getDoc(saveRef);
    if (snap.exists()) {
      // Already saved to this specific list (or default)
      return true; 
    } else {
      const payload: Omit<SaveRecord, 'id'> = {
        articleId: article.id,
        userId,
        articleTitle: article.title,
        articleSlug: article.slug,
        articleImage: article.featuredImage,
        categoryName: article.categoryName,
        authorName: article.authorName,
        readingTime: article.readingTime,
        listId,
        createdAt: new Date().toISOString(),
      };
      await setDoc(saveRef, payload);
      try {
        await updateDoc(articleRef, { savesCount: increment(1) });
      } catch {
        // ignore
      }
      return true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SAVES_COL}/${saveDocId}`);
  }
}

export async function removeArticleFromList(articleId: string, userId: string, listId?: string): Promise<boolean> {
  const saveDocId = `${articleId}_${userId}_${listId || 'default'}`;
  const saveRef = doc(db, SAVES_COL, saveDocId);
  const articleRef = doc(db, ARTICLES_COL, articleId);

  try {
    const snap = await getDoc(saveRef);
    if (snap.exists()) {
      await deleteDoc(saveRef);
      try {
        await updateDoc(articleRef, { savesCount: increment(-1) });
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SAVES_COL}/${saveDocId}`);
  }
}

export async function getListArticles(listId: string): Promise<SaveRecord[]> {
  try {
    const colRef = collection(db, SAVES_COL);
    const q = query(colRef, where('listId', '==', listId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SaveRecord)).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SAVES_COL);
  }
}

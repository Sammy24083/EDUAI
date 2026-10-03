import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Article, SaveRecord } from '../types';

const LIKES_COL = 'likes';
const SAVES_COL = 'saves';
const ARTICLES_COL = 'articles';

export async function hasUserLiked(articleId: string, userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const likeDocId = `${articleId}_${userId}`;
    const snap = await getDoc(doc(db, LIKES_COL, likeDocId));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function toggleLike(articleId: string, userId: string): Promise<boolean> {
  const likeDocId = `${articleId}_${userId}`;
  const likeRef = doc(db, LIKES_COL, likeDocId);
  const articleRef = doc(db, ARTICLES_COL, articleId);

  try {
    const snap = await getDoc(likeRef);
    if (snap.exists()) {
      await deleteDoc(likeRef);
      try {
        await updateDoc(articleRef, { likesCount: increment(-1) });
      } catch {
        // ignore
      }
      return false;
    } else {
      await setDoc(likeRef, {
        articleId,
        userId,
        createdAt: new Date().toISOString(),
      });
      try {
        await updateDoc(articleRef, { likesCount: increment(1) });
      } catch {
        // ignore
      }
      return true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${LIKES_COL}/${likeDocId}`);
  }
}

export async function hasUserSaved(articleId: string, userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const saveDocId = `${articleId}_${userId}`;
    const snap = await getDoc(doc(db, SAVES_COL, saveDocId));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function toggleSave(article: Article, userId: string): Promise<boolean> {
  const saveDocId = `${article.id}_${userId}`;
  const saveRef = doc(db, SAVES_COL, saveDocId);
  const articleRef = doc(db, ARTICLES_COL, article.id);

  try {
    const snap = await getDoc(saveRef);
    if (snap.exists()) {
      await deleteDoc(saveRef);
      try {
        await updateDoc(articleRef, { savesCount: increment(-1) });
      } catch {
        // ignore
      }
      return false;
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

export async function getUserSavedArticles(userId: string): Promise<SaveRecord[]> {
  try {
    const colRef = collection(db, SAVES_COL);
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SaveRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SAVES_COL);
  }
}

export async function markArticleCompleted(article: Article, userId: string): Promise<boolean> {
  const compDocId = `${article.id}_${userId}_comp`;
  const compRef = doc(db, 'completions', compDocId);
  const articleRef = doc(db, ARTICLES_COL, article.id);

  try {
    const snap = await getDoc(compRef);
    if (snap.exists()) {
      return false; // Already completed
    }
    
    await setDoc(compRef, {
      articleId: article.id,
      userId,
      createdAt: new Date().toISOString()
    });
    
    try {
      await updateDoc(articleRef, { completionsCount: increment(1) });
    } catch {
      // ignore
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'completions');
  }
}

export async function hasUserCompleted(articleId: string, userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const compDocId = `${articleId}_${userId}_comp`;
    const snap = await getDoc(doc(db, 'completions', compDocId));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function submitArticleRating(article: Article, userId: string, rating: number): Promise<boolean> {
  const ratingDocId = `${article.id}_${userId}_rating`;
  const ratingRef = doc(db, 'ratings', ratingDocId);
  const articleRef = doc(db, ARTICLES_COL, article.id);

  try {
    const snap = await getDoc(ratingRef);
    if (snap.exists()) {
      return false; // Already rated
    }
    
    await setDoc(ratingRef, {
      articleId: article.id,
      userId,
      rating,
      createdAt: new Date().toISOString()
    });
    
    try {
      // For average rating, we have to fetch the document first
      const articleSnap = await getDoc(articleRef);
      if (articleSnap.exists()) {
        const data = articleSnap.data();
        const currentCount = data.ratingsCount || 0;
        const currentAvg = data.averageRating || 0;
        
        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + rating) / newCount;
        
        await updateDoc(articleRef, {
          ratingsCount: newCount,
          averageRating: newAvg
        });
      }
    } catch {
      // ignore
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'ratings');
  }
}

export async function getUserArticleRating(articleId: string, userId: string): Promise<number | null> {
  if (!userId) return null;
  try {
    const ratingDocId = `${articleId}_${userId}_rating`;
    const snap = await getDoc(doc(db, 'ratings', ratingDocId));
    if (snap.exists()) {
      return snap.data().rating;
    }
    return null;
  } catch {
    return null;
  }
}

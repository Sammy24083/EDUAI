import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Comment, CommentStatus } from '../types';

const COMMENTS_COL = 'comments';
const ARTICLES_COL = 'articles';

export async function getCommentsForArticle(articleId: string): Promise<Comment[]> {
  try {
    const colRef = collection(db, COMMENTS_COL);
    const q = query(
      colRef,
      where('articleId', '==', articleId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
  } catch (error) {
    try {
      const fallbackQ = query(
        collection(db, COMMENTS_COL),
        where('articleId', '==', articleId)
      );
      const snap = await getDocs(fallbackQ);
      return snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Comment))
        .filter(c => c.status === 'approved');
    } catch {
      handleFirestoreError(error, OperationType.LIST, COMMENTS_COL);
    }
  }
}

export async function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likesCount' | 'status'>): Promise<string> {
  const docRef = doc(collection(db, COMMENTS_COL));
  const now = new Date().toISOString();
  try {
    await setDoc(docRef, {
      ...comment,
      status: 'approved',
      likesCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Increment commentsCount on article
    try {
      const artRef = doc(db, ARTICLES_COL, comment.articleId);
      await updateDoc(artRef, {
        commentsCount: increment(1),
      });
    } catch {
      // Non-blocking
    }

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COMMENTS_COL}/${docRef.id}`);
  }
}

export async function deleteComment(id: string, articleId: string): Promise<void> {
  const docRef = doc(db, COMMENTS_COL, id);
  try {
    await deleteDoc(docRef);
    try {
      const artRef = doc(db, ARTICLES_COL, articleId);
      await updateDoc(artRef, {
        commentsCount: increment(-1),
      });
    } catch {
      // Non-blocking
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COMMENTS_COL}/${id}`);
  }
}

export async function getAllCommentsAdmin(): Promise<Comment[]> {
  try {
    const colRef = collection(db, COMMENTS_COL);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COMMENTS_COL);
  }
}

export const getAllCommentsForAdmin = getAllCommentsAdmin;

export async function updateCommentStatus(id: string, status: CommentStatus): Promise<void> {
  const docRef = doc(db, COMMENTS_COL, id);
  try {
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COMMENTS_COL}/${id}`);
  }
}

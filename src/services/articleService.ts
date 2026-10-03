import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Article, ArticleStatus } from '../types';
import { SEED_ARTICLES } from './seedService';

const ARTICLES_COLLECTION = 'articles';

export async function getPublishedArticles(limitCount = 20, categorySlug?: string): Promise<Article[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    let q;
    if (categorySlug) {
      q = query(
        colRef,
        where('status', '==', 'published'),
        where('categorySlug', '==', categorySlug),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
    } else {
      q = query(
        colRef,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article));
    }

    // Curated seed fallback if collection is not yet populated
    let fallback = SEED_ARTICLES.filter(a => a.status === 'published');
    if (categorySlug) {
      fallback = fallback.filter(a => a.categorySlug === categorySlug);
    }
    return fallback.slice(0, limitCount).map(a => ({ id: a.slug, ...a } as unknown as Article));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
  }
}

export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      colRef,
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...(snapshot.docs[0].data() as Record<string, unknown>) } as unknown as Article;
    }
    // Fallback to most recent published
    const recentQ = query(
      colRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(1)
    );
    const recentSnap = await getDocs(recentQ);
    if (!recentSnap.empty) {
      return { id: recentSnap.docs[0].id, ...(recentSnap.docs[0].data() as Record<string, unknown>) } as unknown as Article;
    }

    // Seed fallback
    const seedFeatured = SEED_ARTICLES.find(a => a.isFeatured && a.status === 'published') || SEED_ARTICLES[0];
    return seedFeatured ? ({ id: seedFeatured.slug, ...seedFeatured } as unknown as Article) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, ARTICLES_COLLECTION);
  }
}

export async function getTrendingArticles(limitCount = 5): Promise<Article[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      colRef,
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article));
    }

    // Fallback if empty
    return SEED_ARTICLES
      .filter(a => a.status === 'published' && a.isTrending)
      .slice(0, limitCount)
      .map(a => ({ id: a.slug, ...a } as unknown as Article));
  } catch (error) {
    // If index is pending or views sorting fallback
    try {
      const fallbackQ = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        limit(limitCount)
      );
      const snap = await getDocs(fallbackQ);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article));
      }
      return SEED_ARTICLES
        .filter(a => a.status === 'published' && a.isTrending)
        .slice(0, limitCount)
        .map(a => ({ id: a.slug, ...a } as unknown as Article));
    } catch {
      handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
    }
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const q = query(colRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      return { id: docData.id, ...(docData.data() as Record<string, unknown>) } as unknown as Article;
    }
    const seed = SEED_ARTICLES.find(a => a.slug === slug);
    return seed ? ({ id: seed.slug, ...seed } as unknown as Article) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${ARTICLES_COLLECTION}/slug/${slug}`);
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as Record<string, unknown>) } as unknown as Article;
    }
    const seed = SEED_ARTICLES.find(a => a.slug === id);
    return seed ? ({ id: seed.slug, ...seed } as unknown as Article) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${ARTICLES_COLLECTION}/${id}`);
  }
}

export async function getRelatedArticles(categoryId: string, currentArticleId: string, limitCount = 3): Promise<Article[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      colRef,
      where('status', '==', 'published'),
      where('categoryId', '==', categoryId),
      limit(limitCount + 1)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article))
      .filter(a => a.id !== currentArticleId)
      .slice(0, limitCount);
  } catch {
    // Fallback if the composite index is missing
    try {
      const fallbackQ = query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        limit(20) // Fetch a batch to filter client-side
      );
      const snap = await getDocs(fallbackQ);
      return snap.docs
        .map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article))
        .filter(a => a.categoryId === categoryId && a.id !== currentArticleId)
        .slice(0, limitCount);
    } catch {
      return [];
    }
  }
}

export async function searchArticles(queryText: string): Promise<Article[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const q = query(colRef, where('status', '==', 'published'), limit(50));
    const snapshot = await getDocs(q);
    const cleanQuery = queryText.toLowerCase().trim();
    if (!cleanQuery) return [];

    return snapshot.docs
      .map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article))
      .filter(article => {
        return (
          article.title.toLowerCase().includes(cleanQuery) ||
          (article.subtitle && article.subtitle.toLowerCase().includes(cleanQuery)) ||
          article.categoryName.toLowerCase().includes(cleanQuery) ||
          article.authorName.toLowerCase().includes(cleanQuery) ||
          (article.tags && article.tags.some(t => t.toLowerCase().includes(cleanQuery))) ||
          article.content.toLowerCase().includes(cleanQuery)
        );
      });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
  }
}

export async function getAuthorArticles(authorId: string): Promise<Article[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      colRef,
      where('authorId', '==', authorId),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
  }
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  try {
    const colRef = collection(db, ARTICLES_COLLECTION);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as Article));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
  }
}

export const getAllArticles = getAllArticlesAdmin;

export async function createArticle(
  articleData: Omit<Article, 'id' | 'views' | 'likesCount' | 'savesCount' | 'commentsCount' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = doc(collection(db, ARTICLES_COLLECTION));
  const now = new Date().toISOString();
  const payload = {
    ...articleData,
    views: 0,
    likesCount: 0,
    savesCount: 0,
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: articleData.status === 'published' ? (articleData.publishedAt || now) : null,
  };

  try {
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ARTICLES_COLLECTION}/${docRef.id}`);
  }
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<void> {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_COLLECTION}/${id}`);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ARTICLES_COLLECTION}/${id}`);
  }
}

export async function incrementArticleViews(id: string): Promise<void> {
  const docRef = doc(db, ARTICLES_COLLECTION, id);
  try {
    await updateDoc(docRef, {
      views: increment(1),
    });
  } catch {
    // Non-blocking view tracking
  }
}

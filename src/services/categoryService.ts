import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Category, Tag } from '../types';
import { SEED_CATEGORIES, SEED_TAGS } from './seedService';

const CATEGORIES_COL = 'categories';
const TAGS_COL = 'tags';

export async function getCategories(): Promise<Category[]> {
  try {
    const colRef = collection(db, CATEGORIES_COL);
    const q = query(colRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    }
    return SEED_CATEGORIES.map(c => ({ id: c.slug, ...c } as Category));
  } catch (error) {
    try {
      const snap = await getDocs(collection(db, CATEGORIES_COL));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
      }
      return SEED_CATEGORIES.map(c => ({ id: c.slug, ...c } as Category));
    } catch {
      return SEED_CATEGORIES.map(c => ({ id: c.slug, ...c } as Category));
    }
  }
}

export async function createCategory(cat: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
  const docRef = doc(collection(db, CATEGORIES_COL));
  try {
    await setDoc(docRef, {
      ...cat,
      createdAt: new Date().toISOString(),
      articleCount: 0,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${CATEGORIES_COL}/${docRef.id}`);
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const docRef = doc(db, CATEGORIES_COL, id);
  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CATEGORIES_COL}/${id}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COL, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COL}/${id}`);
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const colRef = collection(db, TAGS_COL);
    const q = query(colRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Tag));
    }
    return SEED_TAGS.map(t => ({ id: t.slug, ...t } as Tag));
  } catch {
    try {
      const snap = await getDocs(collection(db, TAGS_COL));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Tag));
      }
      return SEED_TAGS.map(t => ({ id: t.slug, ...t } as Tag));
    } catch {
      return SEED_TAGS.map(t => ({ id: t.slug, ...t } as Tag));
    }
  }
}

export async function createTag(tag: Omit<Tag, 'id' | 'createdAt'>): Promise<string> {
  const docRef = doc(collection(db, TAGS_COL));
  try {
    await setDoc(docRef, {
      ...tag,
      createdAt: new Date().toISOString(),
      articleCount: 0,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${TAGS_COL}/${docRef.id}`);
  }
}

export async function deleteTag(id: string): Promise<void> {
  const docRef = doc(db, TAGS_COL, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${TAGS_COL}/${id}`);
  }
}

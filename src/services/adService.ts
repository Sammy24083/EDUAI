import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Advertisement, AdPlacement } from '../types';

const ADS_COL = 'advertisements';

export async function getActiveAdsByPlacement(placement: AdPlacement): Promise<Advertisement[]> {
  try {
    const colRef = collection(db, ADS_COL);
    const q = query(colRef, where('placement', '==', placement), where('active', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Advertisement));
  } catch {
    return [];
  }
}

export async function getAllAdsAdmin(): Promise<Advertisement[]> {
  try {
    const colRef = collection(db, ADS_COL);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Advertisement));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ADS_COL);
  }
}

export const getAllAdsForAdmin = getAllAdsAdmin;

export async function createAd(ad: Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt'>): Promise<string> {
  const docRef = doc(collection(db, ADS_COL));
  try {
    await setDoc(docRef, {
      ...ad,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ADS_COL}/${docRef.id}`);
  }
}

export async function updateAd(id: string, updates: Partial<Advertisement>): Promise<void> {
  const docRef = doc(db, ADS_COL, id);
  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ADS_COL}/${id}`);
  }
}

export async function deleteAd(id: string): Promise<void> {
  const docRef = doc(db, ADS_COL, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ADS_COL}/${id}`);
  }
}

export async function recordAdClick(id: string): Promise<void> {
  const docRef = doc(db, ADS_COL, id);
  try {
    await updateDoc(docRef, { clicks: increment(1) });
  } catch {
    // Non-blocking
  }
}

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { NewsletterSubscriber } from '../types';

const SUBSCRIBERS_COL = 'newsletterSubscribers';

export async function subscribeNewsletter(email: string, source = 'homepage_cta'): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length > 256) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  try {
    const colRef = collection(db, SUBSCRIBERS_COL);
    const docRef = doc(colRef);
    const payload: Omit<NewsletterSubscriber, 'id'> = {
      email: cleanEmail,
      status: 'active',
      source,
      subscribedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return { success: true, message: 'Welcome to EduAI! You have successfully subscribed.' };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, SUBSCRIBERS_COL);
  }
}

export async function getAllSubscribersAdmin(): Promise<NewsletterSubscriber[]> {
  try {
    const colRef = collection(db, SUBSCRIBERS_COL);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NewsletterSubscriber));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SUBSCRIBERS_COL);
  }
}

export const getNewsletterSubscribers = getAllSubscribersAdmin;

export async function unsubscribeNewsletter(email: string): Promise<void> {
  try {
    const colRef = collection(db, SUBSCRIBERS_COL);
    const q = query(colRef, where('email', '==', email.trim().toLowerCase()), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, SUBSCRIBERS_COL);
  }
}

export async function deleteSubscriber(id: string): Promise<void> {
  const docRef = doc(db, SUBSCRIBERS_COL, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SUBSCRIBERS_COL}/${id}`);
  }
}

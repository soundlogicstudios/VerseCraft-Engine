/**
 * Firebase Sync Logic
 */
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from './init.js';

const db = getFirestore(app);

export async function saveProgress(userId, data) {
  await setDoc(doc(db, 'users', userId), data);
  console.log('Progress saved to Firebase.');
}

export async function loadProgress(userId) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? snap.data() : null;
}

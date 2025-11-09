import { db } from '@/services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Stores/updates a user's email and last login details in Firestore
export async function saveLoginEmail(email, profile = {}, uid) {
  if (!email) return;
  const id = String(email).toLowerCase();
  const ref = doc(db, 'users', id);
  const payload = {
    email: id,
    uid: uid || null,
    lastLoginAt: serverTimestamp(),
    dogId: profile.dogId || null,
    name: profile.name || null,
  };
  await setDoc(ref, payload, { merge: true });
}

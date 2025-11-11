// ✅ /services/firebase.js — Correct Realtime Database Firebase setup for SmartCollar

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your SmartCollar Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzOQ2vUF4nb-OpXSlAEfKTDiqPClxMvTQ",
  authDomain: "smartcollar-10d06.firebaseapp.com",
  databaseURL: "https://smartcollar-10d06-default-rtdb.firebaseio.com",
  projectId: "smartcollar-10d06",
  storageBucket: "smartcollar-10d06.firebasestorage.app",
  messagingSenderId: "698896917902",
  appId: "1:698896917902:web:5cc732d1f55209d6bc70df",
};

// ✅ Initialize Firebase once (prevents reinitialization errors)
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Optional: Auth + Firestore (if needed later)
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Optional: Analytics support for browsers (safe check)
export let analytics = null;
(async () => {
  try {
    if (typeof window !== "undefined" && (await analyticsIsSupported())) {
      analytics = getAnalytics(app);
    }
  } catch {
    analytics = null;
  }
})();

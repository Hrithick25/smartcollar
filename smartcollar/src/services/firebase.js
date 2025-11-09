// Firebase initialization for SmartCollar
// Safe to import anywhere. Only initializes once.
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDn5bxJSs-5La0_1eTn48Vnm0Le3mab3LU',
  authDomain: 'iot-smartcollar.firebaseapp.com',
  projectId: 'iot-smartcollar',
  storageBucket: 'iot-smartcollar.firebasestorage.app',
  messagingSenderId: '753784817791',
  appId: '1:753784817791:web:fbbaf805980d063161974a',
  measurementId: 'G-M5XVS86MG0',
};

// Initialize Firebase only once
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Core services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in supported environments (browser + https)
export let analytics = null;
(async () => {
  try {
    if (typeof window !== 'undefined' && (await analyticsIsSupported())) {
      analytics = getAnalytics(app);
    }
  } catch (e) {
    // Analytics not supported (e.g., in development or non-HTTPS); ignore
    analytics = null;
  }
})();

export default app;

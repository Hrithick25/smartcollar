// Realtime Database bindings for SmartCollar
// Reuses the initialized Firebase app from services
import { app } from '@/services/firebase';
import { getDatabase, ref, onValue, push } from 'firebase/database';

export const db = getDatabase(app);
export { ref, onValue, push };

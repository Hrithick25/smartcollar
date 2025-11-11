import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzOQ2vUF4nb-OpXSlAEfKTDiqPClxMvTQ",
  authDomain: "smartcollar-10d06.firebaseapp.com",
  databaseURL: "https://smartcollar-10d06-default-rtdb.firebaseio.com",
  projectId: "smartcollar-10d06",
  storageBucket: "smartcollar-10d06.firebasestorage.app",
  messagingSenderId: "698896917902",
  appId: "1:698896917902:web:5cc732d1f55209d6bc70df"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue };

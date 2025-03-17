import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAb4Mt8rCjwwz7s41Cg3HC0BIBxDZ0jQEc",
  authDomain: "flexible-payroll.firebaseapp.com",
  projectId: "flexible-payroll",
  storageBucket: "flexible-payroll.firebasestorage.app",
  messagingSenderId: "694782527343",
  appId: "1:694782527343:web:8b250b494b8154288d8a9a",
  measurementId: "G-EV01M9RSGE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure auth persistence
auth.setPersistence('browserLocal');
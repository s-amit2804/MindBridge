import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

// ────────────────────────────────────────────
// 🔑  REPLACE THESE WITH YOUR FIREBASE CONFIG
// ────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyClhTysYqsAFvO5rgZkOt5lRbDDfx2Tb7Q",
  authDomain: "neuralyn-d3124.firebaseapp.com",
  projectId: "neuralyn-d3124",
  storageBucket: "neuralyn-d3124.firebasestorage.app",
  messagingSenderId: "633753938857",
  appId: "1:633753938857:web:050380caf15697a32bb2b8",
  measurementId: "G-VHN222LJW6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
};

export default app;

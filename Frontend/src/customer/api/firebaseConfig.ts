// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLIs1Y8b99N3P-R2IyuP9P0rZFxxLMaTo",
  authDomain: "f-salon-test.firebaseapp.com",
  projectId: "f-salon-test",
  storageBucket: "f-salon-test.firebasestorage.app",
  messagingSenderId: "1035744192541",
  appId: "1:1035744192541:web:a6790e3839f3f08dac7ef4",
  measurementId: "G-CCXT4GN0WD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

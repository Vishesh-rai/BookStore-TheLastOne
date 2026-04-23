// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA-EYmZxX2MaF-im6Pw2kwGgiaAKxTVS2M",
  authDomain: "bookstore-13610.firebaseapp.com",
  projectId: "bookstore-13610",
  storageBucket: "bookstore-13610.firebasestorage.app",
  messagingSenderId: "637246064885",
  appId: "1:637246064885:web:3ebc8190e08b2c2d0fddbc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ ADD THESE (IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);

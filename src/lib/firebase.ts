// src/lib/firebase.ts
// ⚠️ Firebase konsolundan aldığın config bilgilerini buraya yapıştır!

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCG3SI1pIKIptpMYfz7c0-7tWzVMWVPgrk",
  authDomain: "login-a4925.firebaseapp.com",
  projectId: "login-a4925",
  storageBucket: "login-a4925.firebasestorage.app",
  messagingSenderId: "436496207458",
  appId: "1:436496207458:web:922add5bf70d83fd2d4b3b",
  measurementId: "G-368LPX0V3P",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
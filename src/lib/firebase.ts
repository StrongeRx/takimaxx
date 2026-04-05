// src/lib/firebase.ts
// API anahtarları .env dosyasından okunur — kaynak koda gömülmez.
// Vercel/Netlify'da Environment Variables panelinden ayarlayın.

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Geliştirme ortamında eksik env değişkenlerini uyar
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, "_$1").toUpperCase()}`);
  if (missing.length > 0) {
    console.warn(
      "[Firebase] Eksik .env değişkenleri:\n" + missing.join("\n") +
      "\n.env.example dosyasını kopyalayıp doldurun."
    );
  }
}

const app = initializeApp(firebaseConfig);

export const auth             = getAuth(app);
export const googleProvider   = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
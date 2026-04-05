// src/lib/firebase.ts
// Firebase config değerleri .env dosyasından okunur.
// .env örneği aşağıdaki gibi olmalıdır (projenin kök dizininde):
//
//   VITE_FIREBASE_API_KEY=AIzaSy...
//   VITE_FIREBASE_AUTH_DOMAIN=login-xxxxx.firebaseapp.com
//   VITE_FIREBASE_PROJECT_ID=login-xxxxx
//   VITE_FIREBASE_STORAGE_BUCKET=login-xxxxx.firebasestorage.app
//   VITE_FIREBASE_MESSAGING_SENDER_ID=436496207458
//   VITE_FIREBASE_APP_ID=1:436496207458:web:xxxxxxxxxxxxx
//   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
//
// ⚠️ .env dosyasını asla Git'e commit etme!
//    .gitignore içinde .env satırının olduğundan emin ol.

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            as string,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        as string,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         as string,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             as string,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     as string,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

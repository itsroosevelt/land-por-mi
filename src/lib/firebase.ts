
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '';
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '';
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '';
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '';
const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '';
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '';

export const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

const hasValidFirebaseConfig = Boolean(
  firebaseApiKey &&
  firebaseApiKey.startsWith('AIza') &&
  firebaseProjectId &&
  firebaseAuthDomain &&
  firebaseAppId
);

const app = hasValidFirebaseConfig
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

const db = app ? getFirestore(app) : ({} as any);
const auth = app ? getAuth(app) : (null as any);
const storage = app ? getStorage(app) : (null as any);
const functions = app ? getFunctions(app) : (null as any);

export const isFirebaseConfigured = hasValidFirebaseConfig;

// Export the services
export { app, db, auth, storage, functions };

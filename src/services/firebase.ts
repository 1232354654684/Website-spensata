import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import rawConfig from '../../firebase-applet-config.json';

const config = {
  apiKey: rawConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: rawConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: rawConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: rawConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: rawConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: rawConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID || '',
  firestoreDatabaseId:
    rawConfig.firestoreDatabaseId ||
    import.meta.env.VITE_FIRESTORE_DATABASE_ID ||
    'ai-studio-smpnegeri1tambak-a2bce7a3-f450-4f56-aa26-535278420f63'
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(config.apiKey && config.projectId && config.apiKey !== '');
};

let app: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(app);
    // CRITICAL: Always pass firestoreDatabaseId for dedicated provisioned databases
    db = getFirestore(app, config.firestoreDatabaseId);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase initialization error:', err);
  }
}

export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  if (!auth) throw new Error('Firebase Authentication belum terinisialisasi.');
  return await signInWithPopup(auth, googleProvider);
};

export const logoutFirebaseAuth = async () => {
  if (auth) {
    await signOut(auth);
  }
};

export const firebaseInfo = {
  projectId: config.projectId,
  firestoreDatabaseId: config.firestoreDatabaseId,
  authDomain: config.authDomain,
  storageBucket: config.storageBucket
};

export { app, auth, db, storage, config as firebaseConfig };
export default config;

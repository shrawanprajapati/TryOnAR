import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingKey = Object.entries(firebaseConfig).find(([, value]) => !value)?.[0];
if (missingKey) {
  console.warn(`Missing Firebase config value: ${missingKey}. Add it to Frontend/.env and restart Expo.`);
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createNativeAuth() {
  try {
    const nativeAuth = require('@firebase/auth') as {
      initializeAuth: (firebaseApp: typeof app, deps?: { persistence?: unknown }) => ReturnType<typeof getAuth>;
      getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown;
    };

    if (typeof nativeAuth.getReactNativePersistence === 'function') {
      return nativeAuth.initializeAuth(app, {
        persistence: nativeAuth.getReactNativePersistence(AsyncStorage),
      });
    }
  } catch {
    // Fall back to default auth if the RN bundle helper is unavailable.
  }

  return getAuth(app);
}

const auth = Platform.OS === 'web' ? getAuth(app) : createNativeAuth();

if (Platform.OS === 'web') {
  setPersistence(auth, browserLocalPersistence).catch(() => undefined);
}

function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error && 'code' in error && typeof error.code === 'string'
      ? error.code
      : undefined;

  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password.';
    case 'auth/api-key-not-valid':
      return 'Your Firebase web app config is invalid. Update Frontend/.env and restart Expo with a cleared cache.';
    default:
      return error instanceof Error ? error.message : 'Authentication failed.';
  }
}

export {
  app,
  auth,
  createUserWithEmailAndPassword,
  getAuthErrorMessage,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
};
export type { User };

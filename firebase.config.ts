// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
//@ts-expect-error - getReactNativePersistence exists in @firebase/auth's react-native export condition, resolved by Metro
import { getReactNativePersistence } from "@firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim();

export const firebaseInitError = firebaseApiKey
  ? null
  : new Error(
      "Missing EXPO_PUBLIC_FIREBASE_API_KEY. Configure it in EAS environment variables for production builds."
    );

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseApiKey ?? "",
  authDomain: "pick-it-up-76318.firebaseapp.com",
  projectId: "pick-it-up-76318",
  storageBucket: "pick-it-up-76318.firebasestorage.app",
  messagingSenderId: "567040220834",
  appId: "1:567040220834:web:c8aeb942a5bc0d271341fb",
  measurementId: "G-C37L4GFE0C"
};

function getOrCreateFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

function getOrCreateFirebaseAuth(app: FirebaseApp): Auth {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

const app = firebaseInitError ? null : getOrCreateFirebaseApp();

export const db: Firestore | null = app ? getFirestore(app) : null;
export const auth: Auth | null = app ? getOrCreateFirebaseAuth(app) : null;



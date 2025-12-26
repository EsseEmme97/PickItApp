// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pick-it-up-76318.firebaseapp.com",
  projectId: "pick-it-up-76318",
  storageBucket: "pick-it-up-76318.firebasestorage.app",
  messagingSenderId: "567040220834",
  appId: "1:567040220834:web:c8aeb942a5bc0d271341fb",
  measurementId: "G-C37L4GFE0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



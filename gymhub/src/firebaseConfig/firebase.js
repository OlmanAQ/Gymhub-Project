// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBt9cQyzHqJrURxkS2mE9tVdH2G_5PiXs4",
  authDomain: "gymhub-c90d3.firebaseapp.com",
  projectId: "gymhub-c90d3",
  storageBucket: "gymhub-c90d3.appspot.com",
  messagingSenderId: "510626731152",
  appId: "1:510626731152:web:33a94981e373f1b75ff415",
  measurementId: "G-WRGDTJ1Q1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const db = getFirestore(app);
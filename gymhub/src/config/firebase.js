// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsVaa2xOhXkYNkchZ3YfGcbGBCmFMtJmI",
  authDomain: "gymhub-project-test.firebaseapp.com",
  projectId: "gymhub-project-test",
  storageBucket: "gymhub-project-test.appspot.com",
  messagingSenderId: "775280087783",
  appId: "1:775280087783:web:28fa6d2ac3f5972eadc842",
  measurementId: "G-TY6MXZEC2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCOITzMisAsyXn9QRfegx7M7gaFkHb1d0",
  authDomain: "studymate-ai-c3a74.firebaseapp.com",
  projectId: "studymate-ai-c3a74",
  storageBucket: "studymate-ai-c3a74.firebasestorage.app",
  messagingSenderId: "419199970926",
  appId: "1:419199970926:web:fac02eaf28403da2df407f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAmYJz688oO_4F6UfHluwiLwuyXb8v8eKM",
  authDomain: "voyageur-ai-travel-planner.firebaseapp.com",
  projectId: "voyageur-ai-travel-planner",
  storageBucket: "voyageur-ai-travel-planner.firebasestorage.app",
  messagingSenderId: "624089531148",
  appId: "1:624089531148:web:85def97a49f272ae13ff29",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

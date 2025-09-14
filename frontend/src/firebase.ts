import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFKo1Llblr6eE_URWf9mUQOQBdgsL7Mm4",
  authDomain: "age-prediction-f9909.firebaseapp.com",
  projectId: "age-prediction-f9909",
  storageBucket: "age-prediction-f9909.firebasestorage.app",
  messagingSenderId: "355682553150",
  appId: "1:355682553150:web:87a49a12a66d77eb87306f",
  measurementId: "G-6GHV0H3S4X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for ZenithRent
const firebaseConfig = {
  apiKey: "AIzaSyD6JI3odvYkefLVlRAIH7DrgDBDISBaMrg",
  authDomain: "zenithrent-e67e2.firebaseapp.com",
  projectId: "zenithrent-e67e2",
  storageBucket: "zenithrent-e67e2.firebasestorage.app",
  messagingSenderId: "242985126962",
  appId: "1:242985126962:web:1eb3c11afc2e0a01f3802b",
  measurementId: "G-610BCK880J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

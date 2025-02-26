// ✅ Import Firebase Functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGSMtpy3jk9IuTWPrai8zTAVkM9HPhumo",
  authDomain: "work-flow-7dacc.firebaseapp.com",
  databaseURL:
    "https://work-flow-7dacc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "work-flow-7dacc",
  storageBucket: "work-flow-7dacc.firebasestorage.app",
  messagingSenderId: "304744628664",
  appId: "1:304744628664:web:5d38e34dd1ed3299288f4d",
  measurementId: "G-EELXSFCQ4H",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ✅ Firestore Database Export

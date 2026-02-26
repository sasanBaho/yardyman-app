// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkEei5sDldeWlMmXB852m_pheh96zF048",
  authDomain: "lawn-snow-6ab68.firebaseapp.com",
  projectId: "lawn-snow-6ab68",
  storageBucket: "lawn-snow-6ab68.firebasestorage.app",
  messagingSenderId: "894448553102",
  appId: "1:894448553102:web:8466eed52ebb1e10e48ddf",
  measurementId: "G-QP14130PHF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, collection, getDocs };
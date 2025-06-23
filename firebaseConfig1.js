import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Opsætning af Firebase - så appen ved hvilket Firebase projekt den skal kommunikere til
const firebaseConfig = {
  apiKey:  "AIzaSyBJK9JNSWlKRFEQgtTlRHsicvRuxpUrpNU",
  authDomain: "esp-project-9f067.firebaseapp.com",
  projectId: "esp-project-9f067",
  storageBucket: "esp-project-9f067.firebasestorage.app",
  messagingSenderId: "238405093551",
  appId: "1:238405093551:web:f5e4f9c2ae07ab5c916c5a",
  measurementId: "G-ZVJ4VN2QQL"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Definerer Firestore
const realtimeDb = getDatabase(app, 'https://esp-project-9f067-default-rtdb.europe-west1.firebasedatabase.app/'); // Definerer realtime databasen
export {db, realtimeDb};
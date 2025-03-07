// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDNztanLkO01ctqVEEhqfMc7FGia6UI1U",
  authDomain: "smartcashbook-3b0fd.firebaseapp.com",
  projectId: "smartcashbook-3b0fd",
  storageBucket: "smartcashbook-3b0fd.firebasestorage.app",
  messagingSenderId: "158352555579",
  appId: "1:158352555579:web:779f966c731a7c9aba661e",
  measurementId: "G-4PLC4YVRC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
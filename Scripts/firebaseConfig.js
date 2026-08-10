// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhPMKn22jvaVrEvoxRDC_ZKaIa3nDFpg4",
  authDomain: "cqvblog.firebaseapp.com",
  projectId: "cqvblog",
  storageBucket: "cqvblog.firebasestorage.app",
  messagingSenderId: "56091698802",
  appId: "1:56091698802:web:7be3873b128846c53b84eb",
  measurementId: "G-93L1RT3P2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);

export { database };
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Replace these placeholders with the actual values from your Firebase console
const firebaseConfig = {
    apiKey: "X",
    authDomain: "cqvblog.firebaseapp.com",
    projectId: "cqvblog",
    storageBucket: "cqvblog.firebasestorage.app",
    messagingSenderId: "56091698802",
    appId: "1:56091698802:web:7be3873b128846c53b84eb",
    measurementId: "G-93L1RT3P2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

// Export database for use in other files
export { database };
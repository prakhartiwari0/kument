
import firebaseConfig from "./config.js"

import { initializeApp } from "firebase/app";



// Authentication imports
import { GoogleAuthProvider, onAuthStateChanged, signOut, getAuth, connectAuthEmulator } from "firebase/auth";


// Firestore imports
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { collection, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";


// Storage Imports
import { getStorage } from "firebase/storage";


// Initialize Firebase
// initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);





// Get Firebase Storage instance
export const storage = getStorage(app);



// export const auth = getAuth();
// export const providerGoogle = new GoogleAuthProvider();


// // Get Firestore instance
// export const db = getFirestore(app);

// Get Auth instance
const auth = getAuth(app);
export const providerGoogle = new GoogleAuthProvider();

// Connect to the Auth Emulator
if (process.env.NODE_ENV === "development") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

// Get Firestore instance
const db = getFirestore(app);

// Connect to the Firestore Emulator
if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export { auth, db };

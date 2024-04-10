// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Import getStorage for Firebase Storage
import { getDatabase } from "firebase/database"; // For Firebase Realtime Database

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwn5N85nZHdS0B9gDfJjivdI_yIyk_Jho",
  authDomain: "cars-inventory-38db0.firebaseapp.com",
  databaseURL: "https://cars-inventory-38db0-default-rtdb.firebaseio.com",
  projectId: "cars-inventory-38db0",
  storageBucket: "cars-inventory-38db0.appspot.com",
  messagingSenderId: "765229110691",
  appId: "1:765229110691:web:1b6409916dd640587b7616",
  measurementId: "G-RYHXJ29302"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

// Export the app, database, and storage to use them in other files
export { app, database, storage };

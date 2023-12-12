import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDdIyKmk_ha7XUnlriYB0gkUnE7KY_ybxk",
  authDomain: "chat-app-91c17.firebaseapp.com",
  databaseURL: "https://chat-app-91c17-default-rtdb.firebaseio.com",
  projectId: "chat-app-91c17",
  storageBucket: "chat-app-91c17.appspot.com",
  messagingSenderId: "914364237943",
  appId: "1:914364237943:web:117ffafc0f40c3b486de72",
  measurementId: "G-NC9GPE7YT6",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const fireStoreDB = getFirestore(firebaseApp);
export const db = getDatabase(firebaseApp);

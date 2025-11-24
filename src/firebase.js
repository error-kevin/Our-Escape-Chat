import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCMwYvltfP3EPNQUx5v_Z6l7kU9MRsuIxY",
  authDomain: "our-escape-chat.firebaseapp.com",
  projectId: "our-escape-chat",
  storageBucket: "our-escape-chat.firebasestorage.app",
  messagingSenderId: "72190418984",
  appId: "1:72190418984:web:3577aa3a6e3061fd1d951d",
  measurementId: "G-803BQHYJ90"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_API_KEY,
  authDomain: "mernesate2.firebaseapp.com",
  projectId: "mernesate2",
  storageBucket: "mernesate2.appspot.com",
  messagingSenderId: "347634831315",
  appId: "1:347634831315:web:211db7ba92ce30045b2926"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
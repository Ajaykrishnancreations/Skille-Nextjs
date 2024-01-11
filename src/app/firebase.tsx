// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcMfOo4z34VrDK03f_tq0-tq_L0Xe82q0",
  authDomain: "skille-nextjs.firebaseapp.com",
  projectId: "skille-nextjs",
  storageBucket: "skille-nextjs.appspot.com",
  messagingSenderId: "114928206756",
  appId: "1:114928206756:web:1c31ca1ec3d273d5957731"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
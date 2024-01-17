import { getAuth } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore,  } from 'firebase/firestore';

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
const apps = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auths = getAuth();


export const auth = getAuth(app)


export { apps, db, auths }
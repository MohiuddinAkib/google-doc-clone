import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const fbConfig = {
  projectId: "myapps-fde31",
  messagingSenderId: "155579129246",
  storageBucket: "myapps-fde31.appspot.com",
  authDomain: "myapps-fde31.firebaseapp.com",
  apiKey: "AIzaSyC3Gp6gY_yOqH02TpAjbitK4JXgV5Raw-4",
  databaseURL: "https://myapps-fde31.firebaseio.com",
  appId: "1:155579129246:web:04568f01562c62222f8a8f",
};

const app = initializeApp(fbConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const gglProvider = new GoogleAuthProvider();

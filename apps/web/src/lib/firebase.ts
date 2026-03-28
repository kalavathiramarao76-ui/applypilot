import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACM78LynuI06ImczdRRf9UsqAFs_vtPwI",
  authDomain: "zypply-39dcd.firebaseapp.com",
  projectId: "zypply-39dcd",
  storageBucket: "zypply-39dcd.firebasestorage.app",
  messagingSenderId: "531419429055",
  appId: "1:531419429055:web:2347a505f5598d1d562e0a",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8_NLsIU-daIZpNmuuAHGDI0ihDrBDqnM",
  authDomain: "app1-99b5a.firebaseapp.com",
  projectId: "app1-99b5a",
  storageBucket: "app1-99b5a.firebasestorage.app",
  messagingSenderId: "967175964103",
  appId: "1:967175964103:web:481ad90d3083be70c6c5e2",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  //   authDomain: import.meta.env.VITE_AUTHDOMAIN,
  //   projectId: import.meta.env.VITE_PROJECT_ID,
  //   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  //   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  //   appId: import.meta.env.VITE_APPID,

  apiKey: "AIzaSyBq-TK5jiLge3uFC0fND6-AiBr5RAmfi7Y",
  authDomain: "loginmyshop-c27df.firebaseapp.com",
  projectId: "loginmyshop-c27df",
  storageBucket: "loginmyshop-c27df.firebasestorage.app",
  messagingSenderId: "137271709956",
  appId: "1:137271709956:web:51de1fd34fc655b806c051",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };

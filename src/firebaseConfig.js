// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRhmBTItw3KoZSY5iT9B8iV_OYoapfnuc",
  authDomain: "react-revision-app.firebaseapp.com",
  projectId: "react-revision-app",
  storageBucket: "react-revision-app.appspot.com",
  messagingSenderId: "952933550046",
  appId: "1:952933550046:web:88584e5685a9bf9fb9ff4f",
  measurementId: "G-9YXLYH4C6Q",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

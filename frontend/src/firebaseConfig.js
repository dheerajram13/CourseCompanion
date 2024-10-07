// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3JXov_oyVxO_bLhB9c6OuC-4LVkEA72A",
  authDomain: "coursecompanion-de8fa.firebaseapp.com",
  projectId: "coursecompanion-de8fa",
  storageBucket: "coursecompanion-de8fa.appspot.com",
  messagingSenderId: "40349560187",
  appId: "1:40349560187:web:1032756de6ff4d52d521de",
  measurementId: "G-R213QRHHRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWB6MSM6UplkqEwTb_9YJyjsu0O9aEeLg",
  authDomain: "university-attendance-695a0.firebaseapp.com",
  projectId: "university-attendance-695a0",
  storageBucket: "university-attendance-695a0.firebasestorage.app",
  messagingSenderId: "7970147480",
  appId: "1:7970147480:web:2e7849174e7545384a14ed",
  measurementId: "G-QD0XV33X11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
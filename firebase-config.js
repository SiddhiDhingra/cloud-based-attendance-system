// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWB6MSM6UplkqEwTb_9YJyjsu0O9aEeLg",
  authDomain: "university-attendance-695a0.firebaseapp.com",
  projectId: "university-attendance-695a0",
  storageBucket: "university-attendance-695a0.appspot.com",
  messagingSenderId: "7970147480",
  appId: "1:7970147480:web:2e7849174e7545384a14ed",
  measurementId: "G-QD0XV33X11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { auth, db };

// app.js
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { collection, getDocs, query, where } 
  from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  try {
    // Step 1: Sign in
    await signInWithEmailAndPassword(auth, email, password);

    // Step 2: Get user role from Firestore
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      const role = userData.role;

      // Step 3: Redirect based on role
      if (role === "teacher") {
        window.location.href = "dashboard_teacher.html";
      } else if (role === "student") {
        window.location.href = "dashboard_student.html";
      } else {
        msg.textContent = "⚠️ Role not assigned!";
      }
    } else {
      msg.textContent = "⚠️ No role found for this email!";
    }

  } catch (error) {
    msg.textContent = error.message;
  }
});

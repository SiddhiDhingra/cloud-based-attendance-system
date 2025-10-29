// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Your Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

// 📘 Mark attendance — only for registered students
document.querySelector("#submitAttendance").addEventListener("click", async () => {
  const courseCode = document.querySelector("#courseCode").value.trim();
  const studentEmail = document.querySelector("#studentEmail").value.trim().toLowerCase();
  const isPresent = document.querySelector("#isPresent").checked;

  if (!courseCode || !studentEmail) {
    alert("⚠️ Please enter both Course Code and Student Email!");
    return;
  }

  try {
    // ✅ Check if student exists in Firestore
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("email", "==", studentEmail));
    const querySnapshot = await getDocs(q);

    console.log("Query result size:", querySnapshot.size); // Debug log

    if (querySnapshot.empty) {
      alert("❌ Student not found in the registered list!");
      return;
    }

    // ✅ Student found — now mark attendance
    await addDoc(collection(db, "attendance"), {
      courseCode,
      studentEmail,
      present: isPresent,
      timestamp: new Date()
    });
    alert("✅ Attendance marked successfully!");

  } catch (error) {
    console.error("Error adding document:", error);
    alert("❌ Error saving attendance. Check console for details.");
  }
});

// 👁 View attendance
document.querySelector("#viewAttendance").addEventListener("click", async () => {
  const email = document.querySelector("#viewEmail").value.trim().toLowerCase();
  const resultDiv = document.querySelector("#attendanceResults");
  resultDiv.innerHTML = "";

  if (!email) {
    alert("⚠️ Please enter your email!");
    return;
  }

  const q = query(collection(db, "attendance"), where("studentEmail", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    resultDiv.innerHTML = "<p>No attendance records found for this email.</p>";
  } else {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      resultDiv.innerHTML += `
        <p>Course: ${data.courseCode} | Present: ${data.present ? "✅" : "❌"} | 
        Date: ${new Date(data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp).toLocaleString()}</p>
      `;
    });
  }
});

// 🔒 Logout functionality
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("👋 Logged out successfully!");
        window.location.href = "index.html"; // Redirect to login page
      })
      .catch((error) => {
        console.error("Logout Error:", error);
        alert("Error logging out: " + error.message);
      });
  });
}

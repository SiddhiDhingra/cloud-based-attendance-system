// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { 
  getAuth, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDWB6MSM6UplkqEwTb_9YJyjsu0O9aEeLg",
  authDomain: "university-attendance-695a0.firebaseapp.com",
  projectId: "university-attendance-695a0",
  storageBucket: "university-attendance-695a0.appspot.com",
  messagingSenderId: "7970147480",
  appId: "1:7970147480:web:2e7849174e7545384a14ed",
  measurementId: "G-QD0XV33X11"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ------------------------------------------------------
// 🔐 Check Authentication
// ------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});
// ------------------------------------------------------
// 📘 Mark Attendance (Teacher)
// ------------------------------------------------------
const submitBtn = document.getElementById("submitAttendance");
if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const courseCode = document.getElementById("courseCode").value.trim();
    const studentEmail = document.getElementById("studentEmail").value.trim().toLowerCase();
    const isPresent = document.getElementById("isPresent").checked;

    if (!courseCode || !studentEmail) {
      alert("⚠️ Enter both Course Code and Student Email!");
      return;
    }

    try {
      // ✅ Step 1: Verify if student exists
      const studentsRef = collection(db, "students");
      const q = query(studentsRef, where("email", "==", studentEmail));
      const studentSnap = await getDocs(q);

      if (studentSnap.empty) {
        alert("❌ Student not found in the registered list!");
        return;
      }

      // ✅ Step 2: Add attendance record if student found
      await addDoc(collection(db, "attendance"), {
        courseCode,
        studentEmail,
        present: isPresent,
        timestamp: serverTimestamp(),
        markedBy: auth.currentUser.email
      });

      alert("✅ Attendance marked successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error while marking attendance. Check console.");
    }
  });
}


// ------------------------------------------------------
// 👁 View Attendance (Both)
// ------------------------------------------------------
const viewBtn = document.getElementById("viewAttendance");
if (viewBtn) {
  viewBtn.addEventListener("click", async () => {
    const email = document.getElementById("viewEmail").value.trim().toLowerCase();
    const resultDiv = document.getElementById("attendanceResults");
    resultDiv.innerHTML = "";

    if (!email) {
      alert("⚠️ Please enter an email!");
      return;
    }

    const q = query(collection(db, "attendance"), where("studentEmail", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      resultDiv.innerHTML = "<p>No records found.</p>";
    } else {
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : "N/A";
        resultDiv.innerHTML += `<p>📘 ${data.courseCode} | ${data.present ? "✅ Present" : "❌ Absent"} | ${date}</p>`;
      });
    }
  });
}

// ------------------------------------------------------
// 🚪 Logout
// ------------------------------------------------------
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("👋 Logged out successfully!");
    window.location.href = "index.html";
  });
}

// Firebase config (use your own values)
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "attendance-system.firebaseapp.com",
  projectId: "attendance-system",
  databaseURL: "https://attendance-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "attendance-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // or firebase.database() if using Realtime DB
function viewAttendance() {
  const email = document.getElementById("studentViewEmail").value.trim();
  const list = document.getElementById("attendanceList");
  list.innerHTML = "<p>Loading...</p>";

  db.collection("attendance").get()
    .then(snapshot => {
      list.innerHTML = "";
      let found = false;

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.students && data.students[email] !== undefined) {
          found = true;
          const status = data.students[email] ? "✅ Present" : "❌ Absent";
          list.innerHTML += `<p>${data.date} - ${data.course}: ${status}</p>`;
        }
      });

      if (!found) list.innerHTML = "<p>No attendance records found for this email.</p>";
    })
    .catch(error => {
      console.error("Error getting documents: ", error);
      list.innerHTML = "<p>Error fetching attendance data.</p>";
    });
}


const loginBtn = document.getElementById('loginBtn');
const googleLogin = document.getElementById('googleLogin');
const msg = document.getElementById('message');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location = "dashboard.html";
  } catch (error) {
    msg.textContent = error.message;
  }
});

googleLogin.addEventListener('click', async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    window.location = "dashboard.html";
  } catch (error) {
    msg.textContent = error.message;
  }
});
function markAttendance() {
  const course = document.getElementById("course").value;
  const studentEmail = document.getElementById("studentEmail").value;
  const status = document.getElementById("status").value === "true";
  const date = new Date().toISOString().split("T")[0];

  db.collection("attendance").doc(`${date}-${course}`).set({
    date: date,
    course: course,
    [`students.${studentEmail}`]: status,
    markedBy: auth.currentUser ? auth.currentUser.email : "unknown"
  }, { merge: true })
  .then(() => {
    document.getElementById("message").innerText = "Attendance marked!";
  })
  .catch(error => {
    console.error("Error marking attendance:", error);
  });
}



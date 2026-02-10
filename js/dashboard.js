// ===== Import Firebase =====
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===== DOM Elements =====
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardCards = document.querySelector(".dashboard-cards");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

// ===== Auth Check =====
let userRegisteredCourses = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../pages/login.html";
  } else {
    userName.textContent = user.displayName || "Trader";

    // Ensure user document exists
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || "Trader",
        email: user.email,
        registeredCourses: []
      });
      userRegisteredCourses = [];
    } else {
      const data = userSnap.data();
      userRegisteredCourses = data.registeredCourses || [];
    }

    // Load courses
    displayCourses();
  }
});

// ===== Logout =====
logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../pages/login.html";
  });
});

// ===== Mobile Sidebar Toggle =====
menuToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// ===== Sidebar Navigation (Single-Page Switching) =====
document.querySelectorAll(".sidebar nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Set active class
    document.querySelectorAll(".sidebar nav a").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const pageId = link.dataset.page;

    // Show only the selected page
    document.querySelectorAll(".dashboard-page").forEach(page => page.style.display = "none");
    document.getElementById(pageId).style.display = "block";

    // Close mobile sidebar
    sidebar?.classList.remove("active");
  });
});

// ===== Fetch and Display Courses =====
async function displayCourses() {
  try {
    const coursesRef = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesRef);

    if (coursesSnapshot.empty) {
      dashboardCards.innerHTML = "<p>No courses available.</p>";
      return;
    }

    const coursesHTML = coursesSnapshot.docs.map(docSnap => {
      const course = docSnap.data();
      const isRegistered = userRegisteredCourses.includes(docSnap.id);

      return `
        <div class="dashboard-card">
          <h3>${course.name}</h3>
          <p class="price">$${course.price}/month</p>
          <ul>
            ${(course.features || []).map(f => `<li>✔ ${f}</li>`).join("")}
          </ul>
          <button class="btn neon-btn" 
            ${isRegistered ? "disabled style='background:#555; cursor:not-allowed'" : ""} 
            data-course-id="${docSnap.id}">
            ${isRegistered ? "Enrolled" : "Enroll Now"}
          </button>
        </div>
      `;
    }).join("");

    dashboardCards.innerHTML = coursesHTML;

    // ===== Add Enroll Button Click Listeners =====
    document.querySelectorAll(".dashboard-card .btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const courseId = e.target.dataset.courseId;
        if (!courseId) return;

        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          registeredCourses: arrayUnion(courseId)
        });

        // Update button state immediately
        e.target.textContent = "Enrolled";
        e.target.disabled = true;
        e.target.style.background = "#555";
        e.target.style.cursor = "not-allowed";

        // Update local array
        userRegisteredCourses.push(courseId);
      });
    });

  } catch (err) {
    console.error("Error fetching courses:", err);
    dashboardCards.innerHTML = "<p>Failed to load courses.</p>";
  }
}

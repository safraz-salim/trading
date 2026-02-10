import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save full name to Firebase user profile
    await updateProfile(userCredential.user, {
      displayName: fullName
    });

    // ✅ Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }
});

import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Already logged in → go to dashboard
    window.location.href = "dashboard.html";
  }
});

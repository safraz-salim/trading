// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAs4KNStuZhj_lVKtJUhjWWU9hcXY89nXM",
  authDomain: "chat-app-7fdb6.firebaseapp.com",
  databaseURL: "https://chat-app-7fdb6-default-rtdb.firebaseio.com/",
  projectId: "chat-app-7fdb6",
  storageBucket: "chat-app-7fdb6.firebasestorage.app",
  messagingSenderId: "582398495923",
  appId: "1:582398495923:web:181dd33c4ebaa7c9b2b4c6",
  measurementId: "G-NSZ94FF0G2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

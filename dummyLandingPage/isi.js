// firebaseautIN.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYQ9CqFLGwHfJXUEYGZTocX2V_esEVDyw",
  authDomain: "websitedatabasetest.firebaseapp.com",
  projectId: "websitedatabasetest",
  storageBucket: "websitedatabasetest.appspot.com",
  messagingSenderId: "1066826882782",
  appId: "1:1066826882782:web:433a1038a8f4c5a36a2c4f",
  measurementId: "G-3DBL7775CX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const welcomeMessageDiv = document.getElementById("welcome-message");
const logoutButton = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const email = user.email;
    welcomeMessageDiv.textContent = "Welcome, " + email;
  } else {
    // User is signed out
    window.location.href = "/login.html"; // redirect to login page
  }
});

logoutButton.addEventListener("click", function () {
  signOut(auth).then(() => {
    // Sign-out successful
    window.location.href = "/landing-page.html"; // redirect to login page
  }).catch((error) => {
    // An error happened
    console.error("Error signing out: ", error);
  });
});

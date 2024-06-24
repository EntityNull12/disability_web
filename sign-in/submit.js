// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYQ9CqFLGwHfJXUEYGZTocX2V_esEVDyw",
  authDomain: "websitedatabasetest.firebaseapp.com",
  projectId: "websitedatabasetest",
  storageBucket: "websitedatabasetest.appspot.com",
  messagingSenderId: "1066826882782",
  appId: "1:1066826882782:web:433a1038a8f4c5a36a2c4f",
  measurementId: "G-3DBL7775CX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(item => {
  item.addEventListener('click', function() {
    const target = document.getElementById(this.getAttribute('data-target'));
    if (target.type === 'password') {
      target.type = 'text';
      this.src = '/src/images/hide.png'; // change to hide image
    } else {
      target.type = 'password';
      this.src = '/src/images/show.png'; // change to show image
    }
  });
});

// Get the modal
const modal = document.getElementById("warningModal");
const modalMessage = document.getElementById("modalMessage");
const closeBtn = document.querySelector(".modal .close");

// Event listener for close button
closeBtn.addEventListener('click', function() {
  modal.style.display = "none";
});

// Event listener for submit button
const submit = document.getElementById("submit");
const messageDiv = document.getElementById("message");

submit.addEventListener("click", async function (event) {
  event.preventDefault();

  const nik = document.getElementById("nik").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const confirmEmail = document.getElementById("confirm-email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const privacyPolicyChecked = document.querySelector('input[name="privacy-policy"]').checked;

  // Basic validation
  if (email !== confirmEmail) {
    showModal("Email dan konfirmasi email tidak cocok.");
    return;
  }
  
  if (password !== confirmPassword) {
    showModal("Password dan konfirmasi password tidak cocok.");
    return;
  }

  if (!privacyPolicyChecked) {
    showModal("Anda harus menyetujui kebijakan privasi.");
    return;
  }

  try {
    // Check if NIK already exists
    const nikDoc = await getDoc(doc(db, 'users', nik));
    if (nikDoc.exists()) {
      showModal("Akun dengan NIK ini sudah ada.");
      return;
    }

    // Log data being sent for debugging
    console.log("Email:", email);
    console.log("Password:", password);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Log user details for debugging
    console.log("User:", user);

    // Store user data in Firestore
    await setDoc(doc(db, 'users', nik), {
      nik: nik,
      name: name,
      email: user.email,
      registrationTimestamp: new Date()
    });

    messageDiv.textContent = "Akun berhasil dibuat!";
    localStorage.setItem('userEmail', email); // Simpan email pengguna di localStorage
    localStorage.setItem('userNik', nik) // Simpan nik pengguna di localStorage

    window.location.href = "/index.html"; // Redirect to landing page
  } catch (error) {
    const errorMessage = error.message;
    showModal("Error: " + errorMessage);
    console.error("Error:", error); // Log the error for debugging
  }
});

function showModal(message) {
  modalMessage.textContent = message;
  modal.style.display = "flex";
}

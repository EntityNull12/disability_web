// Import the functions you need from the Firebase SDKs
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "websitedatabasetest.firebaseapp.com",
    projectId: "websitedatabasetest",
    databaseURL: "https://websitedatabasetest-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "websitedatabasetest.appspot.com",
    messagingSenderId: "1066826882782",
    appId: "1:1066826882782:web:433a1038a8f4c5a36a2c4f",
    measurementId: "G-3DBL7775CX"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
const db = getDatabase(app);

// Reference to the "users" node in Firebase Realtime Database
const usersRef = ref(db, 'users');

// Initialize counts for each category
const ageCategories = {
    "Pre-boomer": 0,
    "Boomer": 0,
    "Gen X": 0,
    "Millennial": 0,
    "Post-Gen Z": 0
};

// Fetch data from Firebase Realtime Database
get(usersRef).then((snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const usia = data.usia; // Assuming 'usia' is the field representing age

            // Determine the age category
            if (usia >= 74) {
                ageCategories["Pre-boomer"] += 1;
            } else if (usia >= 56 && usia <= 74) {
                ageCategories["Boomer"] += 1;
            } else if (usia >= 41 && usia <= 55) {
                ageCategories["Gen X"] += 1;
            } else if (usia >= 25 && usia <= 40) {
                ageCategories["Millennial"] += 1; // Corrected spelling to "Millennial"
            } else if (usia <= 24) {
                ageCategories["Post-Gen Z"] += 1;
            }
        });

        // Convert counts to data array
        const data = Object.values(ageCategories);

        // Log data array and sorted data to console
        console.log("Data array:", data);
        console.log("Sorted data:", ageCategories);
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error("Error getting data:", error);
});

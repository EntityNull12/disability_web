// Inisialisasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDYQ9CqFLGwHfJXUEYGZTocX2V_esEVDyw",
    authDomain: "websitedatabasetest.firebaseapp.com",
    projectId: "websitedatabasetest",
    storageBucket: "websitedatabasetest.appspot.com",
    messagingSenderId: "1066826882782",
    appId: "1:1066826882782:web:433a1038a8f4c5a36a2c4f",
    measurementId: "G-3DBL7775CX"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Fungsi untuk menangani pengiriman formulir
  document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah pengiriman formulir default
  
    // Mengambil nilai dari input
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Mendaftarkan pengguna menggunakan Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Sukses mendaftarkan pengguna
        const user = userCredential.user;
        console.log("Pengguna berhasil mendaftar:", user.uid);
        
        // Menyimpan data pengguna ke Firebase Database
        firebase.database().ref('users/' + user.uid).set({
          name: name,
          email: email
        }).then(() => {
          console.log("Data pengguna disimpan ke Firebase Database.");
          // Redirect to success page or perform other actions here
        }).catch((error) => {
          console.error("Gagal menyimpan data pengguna:", error);
        });
      })
      .catch((error) => {
        // Gagal mendaftarkan pengguna
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", errorMessage);
      });
  });
  
// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDYQ9CqFLGwHfJXUEYGZTocX2V_esEVDyw",
    authDomain: "websitedatabasetest.firebaseapp.com",
    projectId: "websitedatabasetest",
    storageBucket: "websitedatabasetest.appspot.com",
    messagingSenderId: "1066826882782",
    appId: "1:1066826882782:web:433a1038a8f4c5a36a2c4f",
    measurementId: "G-3DBL7775CX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();

// Form submission handler for KIA Disabilitas
document.getElementById('kia-disabilitas-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Fetch form values
    var nama = document.getElementsByName('nama')[0].value;
    var tanggalLahir = document.getElementsByName('tanggal_lahir')[0].value;
    var alamat = document.getElementsByName('alamat')[0].value;
    var jenisDisabilitas = document.getElementsByName('jenis_disabilitas')[0].value;
    var berkasDisabilitas = document.getElementsByName('berkas_disabilitas')[0].files[0];

    // Use the nama as the document ID (replace any non-alphanumeric characters)
    var applicationDocId = nama.replace(/[^a-zA-Z0-9]/g, "_");

    // Show uploading message
    showMessage('Sedang mengunggah, harap tunggu...');

    // Save data to Firestore under 'kiaDisabilitas'
    var applicationDocRef = db.collection('kiaDisabilitas').doc(applicationDocId);

    applicationDocRef.set({
        nama: nama,
        tanggalLahir: tanggalLahir,
        alamat: alamat,
        jenisDisabilitas: jenisDisabilitas
    })
    .then(function() {
        // Upload Surat Keterangan Disabilitas to Firebase Storage if provided
        if (berkasDisabilitas) {
            uploadBerkasDisabilitas(applicationDocId, berkasDisabilitas);
        } else {
            showMessage('Data berhasil disimpan.');
        }
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        showMessage('Terjadi kesalahan saat menyimpan data.', true);
    });
});

// Function to upload Surat Keterangan Disabilitas to Firebase Storage
function uploadBerkasDisabilitas(docId, berkasDisabilitas) {
    var storageRef = storage.ref();
    var fileName = `${docId}_BerkasDisabilitas.${berkasDisabilitas.name.split('.').pop()}`;
    var uploadTask = storageRef.child('kia_disabilitas/' + fileName).put(berkasDisabilitas);

    uploadTask.on('state_changed', 
        function(snapshot) {
            // Track upload progress (optional)
        }, 
        function(error) {
            console.error('Error uploading berkas disabilitas:', error);
            showMessage('Terjadi kesalahan saat mengunggah berkas disabilitas.', true);
        }, 
        function() {
            showMessage('Berkas disabilitas berhasil diunggah.');
        }
    );
}

// Function to display messages to the user
function showMessage(message, isError = false) {
    var messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.classList.remove('text-red-500', 'text-green-500');
    if (isError) {
        messageElement.classList.add('text-red-500');
    } else {
        messageElement.classList.add('text-green-500');
    }
    document.querySelector('main').appendChild(messageElement);
}

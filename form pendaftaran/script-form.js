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

document.addEventListener('DOMContentLoaded', function() {
    // Ambil nama dan email dari localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    // Isi input nama dan email secara otomatis jika data ada di localStorage
    if (userName) {
        document.getElementById('fullName').value = userName;
    }
    if (userEmail) {
        document.getElementById('email').value = userEmail;
    }
});

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Fetch form values
    var fullName = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var usia = document.getElementById('usia').value;
    var address = document.getElementById('address').value;
    var institution = document.getElementById('institution').value;
    var major = document.getElementById('major').value;
    var parentIncome = document.getElementById('parentIncome').value;
    var achievements = document.getElementById('achievements').value;
    var motivation = document.getElementById('motivation').value;
    var parentContact = document.getElementById('parentContact').value;
    var disabilityType = document.getElementById('disabilityType').value;
    var academicNeeds = document.getElementById('academicNeeds').value;
    var specialAccommodation = document.getElementById('specialAccommodation').value;
    var additionalDocuments = document.getElementById('additionalDocuments').files;

    // Ambil nama pengguna dari localStorage
    const userName = localStorage.getItem('userName') || "Unknown";

    // Buat nama folder dengan format "Berkas pengajuan {NamaPengguna}"
    var folderName = `Berkas pengajuan ${userName}`;

    // Use the fullName as the document ID
    var applicationDocId = fullName.replace(/[^a-zA-Z0-9]/g, "_");

    // Show uploading message
    showMessage('Sedang mengunggah, harap tunggu...');

    // Check if the document already exists
    db.collection('scholarshipApplications').doc(folderName).collection('applications').doc(applicationDocId).get()
    .then(function(doc) {
        if (doc.exists) {
            showMessage('Anda sudah mengajukan pendaftaran. Hanya satu kali pengajuan diperbolehkan.', true);
        } else {
            // Save data to Firestore under 'scholarshipApplications/{folderName}/{applicationDocId}'
            var applicationDocRef = db.collection('scholarshipApplications').doc(folderName).collection('applications').doc(applicationDocId);

            applicationDocRef.set({
                fullName: fullName,
                email: email,
                phone: phone,
                gender: gender,
                usia: usia,
                address: address,
                institution: institution,
                major: major,
                parentIncome: parentIncome,
                achievements: achievements,
                motivation: motivation,
                parentContact: parentContact,
                disabilityType: disabilityType,
                academicNeeds: academicNeeds,
                specialAccommodation: specialAccommodation
            })
            .then(function() {
                // Upload additional documents to Firebase Storage if provided
                if (additionalDocuments.length > 0) {
                    uploadDocuments(folderName, applicationDocId, additionalDocuments);
                } else {
                    showMessage('Data berhasil disimpan.');
                }
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                showMessage('Terjadi kesalahan saat menyimpan data.', true);
            });
        }
    })
    .catch(function(error) {
        console.error("Error checking document existence: ", error);
        showMessage('Terjadi kesalahan saat memeriksa data.', true);
    });
});

// Function to upload additional documents to Firebase Storage
function uploadDocuments(folderName, docId, documents) {
    var storageRef = storage.ref();
    var docRef = storageRef.child('scholarship_applications/' + folderName );

    var uploadTasks = []; // To track all upload tasks

    for (let i = 0; i < documents.length; i++) {
        let documentFile = documents[i];
        let documentFileName = `${docId}_${documentFile.name}`;
        let documentUploadTask = docRef.child('documents/' + documentFileName).put(documentFile);

        uploadTasks.push(documentUploadTask);

        documentUploadTask.on('state_changed', 
            function(snapshot) {
                // Track upload progress (optional)
            }, 
            function(error) {
                console.error('Error uploading document:', error);
                showMessage('Terjadi kesalahan saat mengunggah dokumen.', true);
            }, 
            function() {
                showMessage('Dokumen berhasil diunggah.');
            }
        );
    }

    // Wait for all uploads to finish
    Promise.all(uploadTasks.map(task => task)).then(function() {
        showMessage('Data dan dokumen berhasil diunggah.');
    }).catch(function(error) {
        console.error('Error during upload process: ', error);
        showMessage('Terjadi kesalahan saat mengunggah dokumen.', true);
    });
}

// Function to display messages to the user
function showMessage(message, isError = false) {
    var messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.classList.remove('text-red-500', 'text-green-500');
    if (isError) {
        messageElement.classList.add('text-red-500');
    } else {
        messageElement.classList.add('text-green-500');
    }
}

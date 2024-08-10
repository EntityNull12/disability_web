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
document.getElementById('jobApplicationForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Fetch form values
    var fullName = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var usia = document.getElementById('usia').value;
    var address = document.getElementById('address').value;
    var education = document.getElementById('education').value;
    var position = document.getElementById('position').value;
    var cv = document.getElementById('cv').files[0];
    var coverLetter = document.getElementById('coverLetter').files[0];

    // Ambil nama pengguna dari localStorage
    const userName = localStorage.getItem('userName') || "Unknown";

    // Buat nama folder dengan format "Berkas pengajuan {NamaPengguna}"
    var folderName = `Berkas pengajuan ${userName}`;

    // Use the fullName as the document ID
    var applicationDocId = fullName.replace(/[^a-zA-Z0-9]/g, "_");

    // Show uploading message
    showMessage('Sedang mengunggah, harap tunggu...');

    // Check if the document already exists
    db.collection('jobApplications').doc(folderName).collection('applications').doc(applicationDocId).get()
    .then(function(doc) {
        if (doc.exists) {
            showMessage('Anda sudah mengajukan lamaran. Hanya satu kali pengajuan diperbolehkan.', true);
        } else {
            // Save data to Firestore under 'jobApplications/{folderName}/{applicationDocId}'
            var applicationDocRef = db.collection('jobApplications').doc(folderName).collection('applications').doc(applicationDocId);

            applicationDocRef.set({
                fullName: fullName,
                email: email,
                phone: phone,
                gender: gender,
                usia: usia,
                address: address,
                education: education,
                position: position
            })
            .then(function() {
                // Upload CV and Cover Letter to Firebase Storage if provided
                if (cv || coverLetter) {
                    uploadDocuments(folderName, applicationDocId, cv, coverLetter);
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

// Function to upload CV and Cover Letter to Firebase Storage
function uploadDocuments(folderName, docId, cv, coverLetter) {
    var storageRef = storage.ref();
    var docRef = storageRef.child('job_applications/' + folderName );

    var uploadTasks = []; // To track all upload tasks

    if (cv) {
        var cvFileName = `${docId}_CV.${cv.name.split('.').pop()}`;
        var cvUploadTask = docRef.child('cv/' + cvFileName).put(cv);

        uploadTasks.push(cvUploadTask);

        cvUploadTask.on('state_changed', 
            function(snapshot) {
                // Track upload progress (optional)
            }, 
            function(error) {
                console.error('Error uploading CV:', error);
                showMessage('Terjadi kesalahan saat mengunggah CV.', true);
            }, 
            function() {
                showMessage('CV berhasil diunggah.');
            }
        );
    }

    if (coverLetter) {
        var coverLetterFileName = `${docId}_CoverLetter.${coverLetter.name.split('.').pop()}`;
        var coverLetterUploadTask = docRef.child('coverLetter/' + coverLetterFileName).put(coverLetter);

        uploadTasks.push(coverLetterUploadTask);

        coverLetterUploadTask.on('state_changed', 
            function(snapshot) {
                // Track upload progress (optional)
            }, 
            function(error) {
                console.error('Error uploading Cover Letter:', error);
                showMessage('Terjadi kesalahan saat mengunggah Surat Lamaran.', true);
            }, 
            function() {
                showMessage('Surat Lamaran berhasil diunggah.');
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

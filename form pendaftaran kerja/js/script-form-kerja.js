// Your web app's Firebase configuration
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
    var experience = document.getElementById('experience').value;
    var skills = document.getElementById('skills').value;
    var references = document.getElementById('references').value;
    var cv = document.getElementById('cv').files[0];
    var coverLetter = document.getElementById('coverLetter').files[0];

    // Save data to Firestore under 'jobApplications/{applicantID}'
    var userNIK = localStorage.getItem('userNIK');
    if (!userNIK) {
        showMessage('Gagal menyimpan data: userNIK tidak tersedia.', true);
        return;
    }

    var applicationDocRef = db.collection('jobApplications').doc();

    applicationDocRef.set({
        fullName: fullName,
        email: email,
        phone: phone,
        gender: gender,
        usia: usia,
        address: address,
        education: education,
        position: position,
        experience: experience,
        skills: skills,
        references: references
    })
    .then(function() {
        // Upload CV and Cover Letter to Firebase Storage if provided
        if (cv || coverLetter) {
            uploadDocuments(applicationDocRef.id, cv, coverLetter);
        } else {
            showMessage('Data berhasil disimpan.');
        }
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        showMessage('Terjadi kesalahan saat menyimpan data.', true);
    });
});

// Function to upload CV and Cover Letter to Firebase Storage
function uploadDocuments(docId, cv, coverLetter) {
    var storageRef = storage.ref();
    var docRef = storageRef.child('job_applications/' + docId);

    if (cv) {
        var cvUploadTask = docRef.child('cv/' + cv.name).put(cv);

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
        var coverLetterUploadTask = docRef.child('coverLetter/' + coverLetter.name).put(coverLetter);

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

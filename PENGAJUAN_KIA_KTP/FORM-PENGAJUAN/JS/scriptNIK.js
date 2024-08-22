document.addEventListener("DOMContentLoaded", function () {
    const email = localStorage.getItem("email");
    if (email) {
      const loginBtn = document.getElementById("loginBtn");
      const registerBtn = document.getElementById("registerBtn");
      const loginBtnDesktop = document.getElementById("loginBtnDesktop");
      const registerBtnDesktop =
        document.getElementById("registerBtnDesktop");

      if (loginBtn && registerBtn) {
        loginBtn.parentNode.removeChild(loginBtn);
        registerBtn.parentNode.innerHTML = `
                  <div class="dashboard-wrapper">
                      <div class="logout-container">
                          <img src="/src/icon/logout.png" alt="Logout" class="logout-icon" id="logoutBtn">
                      </div>
                      <a href="../Dashboard/Dasboard.html" type="button" class="dashboard-link text-black font-medium rounded-full text-sm px-5 py-2.5">
                          Dashboard
                      </a>
                  </div>
              `;
      }

      if (loginBtnDesktop && registerBtnDesktop) {
        loginBtnDesktop.parentNode.removeChild(loginBtnDesktop);
        registerBtnDesktop.parentNode.innerHTML = `
                  <div class="dashboard-wrapper">
                      <div class="logout-container">
                          <img src="/src/icon/logout.png" alt="Logout" class="logout-icon" id="logoutBtnDesktop">
                      </div>
                      <a href="../Dashboard/Dasboard.html" type="button" class="dashboard-link text-black font-medium rounded-full text-sm px-5 py-2.5">
                          Dashboard
                      </a>
                  </div>
              `;
      }

      const logoutBtn = document.getElementById("logoutBtn");
      const logoutBtnDesktop = document.getElementById("logoutBtnDesktop");

      if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
          localStorage.clear();
          window.location.reload();
        });
      }

      if (logoutBtnDesktop) {
        logoutBtnDesktop.addEventListener("click", function () {
          localStorage.clear();
          window.location.reload();
        });
      }
    }
  });

// Form submission handler for NIK Disabilitas
document.getElementById('nik-disabilitas-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Fetch form values
    var nama = document.getElementsByName('nama')[0].value;
    var tanggalLahir = document.getElementsByName('tanggal_lahir')[0].value;
    var tempatLahir = document.getElementsByName('tempat_lahir')[0].value;
    var alamat = document.getElementsByName('alamat')[0].value;
    var agama = document.getElementsByName('jenis_disabilitas')[0].value;
    var jenisDisabilitas = document.getElementsByName('jenis_disabilitas')[1].value;
    var alatBantu = document.getElementsByName('alat_bantu')[0].value;
    var kartuKeluarga = document.getElementsByName('Kartu_Keluarga')[0].value;
    var berkasKK = document.getElementsByName('berkas_KK')[0].files[0];
    var foto34 = document.getElementsByName('foto_3x4')[0].files[0];

    // Use the nama as the document ID (replace any non-alphanumeric characters)
    var applicationDocId = nama.replace(/[^a-zA-Z0-9]/g, "_");

    // Show uploading message
    showMessage('Sedang mengunggah, harap tunggu...');

    // Save data to Firestore under 'nikDisabilitas'
    var applicationDocRef = db.collection('nikDisabilitas').doc(applicationDocId);

    applicationDocRef.set({
        nama: nama,
        tanggalLahir: tanggalLahir,
        tempatLahir: tempatLahir,
        alamat: alamat,
        agama: agama,
        jenisDisabilitas: jenisDisabilitas,
        alatBantu: alatBantu,
        kartuKeluarga: kartuKeluarga
    })
    .then(function() {
        // Upload files to Firebase Storage if provided
        var uploadTasks = [];
        if (berkasKK) {
            uploadTasks.push(uploadFile(applicationDocId, 'berkasKK', berkasKK));
        }
        if (foto34) {
            uploadTasks.push(uploadFile(applicationDocId, 'foto34', foto34));
        }

        // Wait for all uploads to complete
        Promise.all(uploadTasks).then(() => {
            showMessage('Data berhasil disimpan dan berkas berhasil diunggah.');
        }).catch(error => {
            console.error('Error uploading files:', error);
            showMessage('Terjadi kesalahan saat mengunggah berkas.', true);
        });
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        showMessage('Terjadi kesalahan saat menyimpan data.', true);
    });
});

// Function to upload a file to Firebase Storage
function uploadFile(docId, fileType, file) {
    var storageRef = storage.ref();
    var fileName = `${docId}_${fileType}.${file.name.split('.').pop()}`;
    var uploadTask = storageRef.child('nik_disabilitas/' + fileName).put(file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
            function(snapshot) {
                // Track upload progress (optional)
            }, 
            function(error) {
                reject(error);
            }, 
            function() {
                resolve();
            }
        );
    });
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

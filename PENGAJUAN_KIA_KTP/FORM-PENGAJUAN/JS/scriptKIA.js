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


document
        .getElementById("kia-disabilitas-form")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          // Handle form submission to Firebase
        }); 

        // Form submission handler for KIA Disabilitas
        document
          .getElementById("kia-disabilitas-form")
          .addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent default form submission
  
            // Fetch form values
            var nama = document.getElementsByName("nama")[0].value;
            var tanggalLahir =
              document.getElementsByName("tanggal_lahir")[0].value;
            var alamat = document.getElementsByName("alamat")[0].value;
            var jenisDisabilitas =
              document.getElementsByName("jenis_disabilitas")[0].value;
            var berkasDisabilitas =
              document.getElementsByName("berkas_disabilitas")[0].files[0];
  
            // Use the nama as the document ID (replace any non-alphanumeric characters)
            var applicationDocId = nama.replace(/[^a-zA-Z0-9]/g, "_");
  
            // Show uploading message
            showMessage("Sedang mengunggah, harap tunggu...");
  
            // Save data to Firestore under 'kiaDisabilitas'
            var applicationDocRef = db
              .collection("kiaDisabilitas")
              .doc(applicationDocId);
  
            applicationDocRef
              .set({
                nama: nama,
                tanggalLahir: tanggalLahir,
                alamat: alamat,
                jenisDisabilitas: jenisDisabilitas,
              })
              .then(function () {
                // Upload Surat Keterangan Disabilitas to Firebase Storage if provided
                if (berkasDisabilitas) {
                  uploadBerkasDisabilitas(applicationDocId, berkasDisabilitas);
                } else {
                  showMessage("Data berhasil disimpan.");
                }
              })
              .catch(function (error) {
                console.error("Error adding document: ", error);
                showMessage("Terjadi kesalahan saat menyimpan data.", true);
              });
          });
  
        // Function to upload Surat Keterangan Disabilitas to Firebase Storage
        function uploadBerkasDisabilitas(docId, berkasDisabilitas) {
          var storageRef = storage.ref();
          var fileName = `${docId}_BerkasDisabilitas.${berkasDisabilitas.name
            .split(".")
            .pop()}`;
          var uploadTask = storageRef
            .child("kia_disabilitas/" + fileName)
            .put(berkasDisabilitas);
  
          uploadTask.on(
            "state_changed",
            function (snapshot) {
              // Track upload progress (optional)
            },
            function (error) {
              console.error("Error uploading berkas disabilitas:", error);
              showMessage(
                "Terjadi kesalahan saat mengunggah berkas disabilitas.",
                true
              );
            },
            function () {
              showMessage("Berkas disabilitas berhasil diunggah.");
            }
          );
        }
  
        // Function to display messages to the user
        function showMessage(message, isError = false) {
          var messageContainer = document.getElementById("messageContainer");
          messageContainer.innerHTML = ""; // Mengosongkan pesan sebelumnya
  
          var messageElement = document.createElement("p");
          messageElement.textContent = message;
          messageElement.classList.remove("text-red-500", "text-green-500");
  
          if (isError) {
            messageElement.classList.add("text-red-500");
          } else {
            messageElement.classList.add("text-green-500");
          }
  
          messageContainer.appendChild(messageElement);
        }
        
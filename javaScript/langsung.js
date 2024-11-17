let manualCard = document.getElementById("manual-card");
let defaultCard = document.getElementById("default-card");
manualCard.style.display = "none";

function manual() {
  defaultCard.style.display = "none";
  manualCard.style.display = "block";
}

document.getElementById('formKelompok').addEventListener('submit', function (event) {
  event.preventDefault(); // Mencegah form submit

  // Mendapatkan nilai dari form
  let kelasTerpilih = document.getElementById('kelas').value;
  let jumlahKelompok = parseInt(document.getElementById('jumlahKelompok').value);

  // Mengambil data siswa dari file JSON
  fetch('../data/nama.json')
    .then(response => response.json())
    .then(dataSiswa => {
      let siswa = dataSiswa[kelasTerpilih];
      if (!siswa) {
        alert("Kelas tidak ditemukan.");
        return;
      }

      // Mengacak array (Fisher-Yates shuffle)
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
      }

      // Mengacak urutan siswa
      shuffle(siswa);

      // Membagi siswa ke dalam kelompok
      let kelompok = [];
      for (let i = 0; i < jumlahKelompok; i++) {
        kelompok[i] = [];
      }

      siswa.forEach((siswa, index) => {
        kelompok[index % jumlahKelompok].push(siswa);
      });

      // Menyembunyikan form dan menampilkan hasil
      document.querySelector('.card-body').style.display = 'none';
      document.getElementById('copyButton').style.display = 'block';

      let hasilDiv = document.getElementById('hasilKelompok');

      let tabelHTML = `<h3>Hasil Pengelompokan:</h3>`;
      tabelHTML += `<table class="table table-bordered"><thead><tr><th>No</th><th>Kelompok</th><th>Anggota</th></tr></thead><tbody>`;

      kelompok.forEach((kelompok, index) => {
        let anggota = `<ul>`;
        kelompok.forEach(siswa => {
          anggota += `<li>${siswa.nama}</li>`;
        });
        anggota += `</ul>`;
        tabelHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>Kelompok ${index + 1}</td>
            <td>${anggota}</td>
          </tr>
        `;
      });

      tabelHTML += `</tbody></table>`;
      hasilDiv.innerHTML = tabelHTML;
    })
    .catch(error => {
      console.error("Error fetching dataSiswa.json:", error);
      alert("Terjadi kesalahan dalam memuat data siswa.");
    });
});

// Fungsi pengelompokan berdasarkan input manual
document.querySelector('#manual-card form').addEventListener('submit', function (event) {
  event.preventDefault(); // Mencegah form submit

  let semuaNama = document.querySelector('#manual-card textarea').value
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0);

  let jumlahKelompok = parseInt(document.querySelector('#manual-card input').value);

  if (semuaNama.length < jumlahKelompok) {
    alert("Jumlah nama tidak cukup untuk dibagi ke dalam kelompok!");
    return;
  }

  // Mengacak urutan nama
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffle(semuaNama);

  // Membagi nama ke dalam kelompok
  let kelompok = [];
  for (let i = 0; i < jumlahKelompok; i++) {
    kelompok[i] = [];
  }

  semuaNama.forEach((nama, index) => {
    kelompok[index % jumlahKelompok].push(nama);
  });

  document.querySelector('#manual-card .card-body').style.display = 'none';
  document.getElementById('copyButton').style.display = 'block';

  let hasilDiv = document.getElementById('hasilKelompok');
  let tabelHTML = `<h3>Hasil Pengelompokan:</h3>`;
  tabelHTML += `<table class="table table-bordered"><thead><tr><th>No</th><th>Kelompok</th><th>Anggota</th></tr></thead><tbody>`;

  kelompok.forEach((group, index) => {
    let anggota = `<ul>`;
    group.forEach(nama => {
      anggota += `<li>${nama}</li>`;
    });
    anggota += `</ul>`;
    tabelHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>Kelompok ${index + 1}</td>
        <td>${anggota}</td>
      </tr>
    `;
  });

  tabelHTML += `</tbody></table>`;
  hasilDiv.innerHTML = tabelHTML;
});

// Fungsi untuk menyalin hasil pengelompokan ke clipboard dalam format teks
document.getElementById('copyButton').addEventListener('click', function () {
  let hasilTabel = '';
  let kelompokTable = document.querySelectorAll('#hasilKelompok table tbody tr');

  kelompokTable.forEach(row => {
    let kelompokName = row.cells[1].innerText;
    let anggotaList = row.cells[2].querySelectorAll('li');
    let anggota = Array.from(anggotaList).map(li => li.innerText).join('\n');
    hasilTabel += `*${kelompokName}*:\n${anggota}\n\n`;
  });

  navigator.clipboard.writeText(hasilTabel).then(() => {
    alert("Hasil pengelompokan telah disalin ke clipboard!");
  }).catch(err => {
    console.error("Error copying to clipboard:", err);
  });
});

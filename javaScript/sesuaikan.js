let manualCard = document.getElementById("manual-card");
let defaultCard = document.getElementById("default-card");
manualCard.style.display = "none";

function back() {
  manualCard.style.display = "none";
  defaultCard.style.display = "block";
}

function manual()
{
  defaultCard.style.display = "none";
  manualCard.style.display ="block";
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

      // Memisahkan siswa berdasarkan gender
      let lakiLaki = siswa.filter(siswa => siswa.gender === 'L');
      let perempuan = siswa.filter(siswa => siswa.gender === 'P');

      // Fungsi untuk mengacak array (Fisher-Yates shuffle)
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
      }

      // Mengacak urutan siswa berdasarkan gender
      shuffle(lakiLaki);
      shuffle(perempuan);

      // Membagi siswa ke dalam kelompok dengan seimbang
      let kelompok = [];
      let lakiPerKelompok = Math.floor(lakiLaki.length / jumlahKelompok);
      let perempuanPerKelompok = Math.floor(perempuan.length / jumlahKelompok);

      // Menyebar laki-laki dan perempuan ke dalam kelompok
      for (let i = 0; i < jumlahKelompok; i++) {
        kelompok[i] = {
          lakiLaki: [],
          perempuan: []
        };
      }

      // Menambahkan laki-laki ke kelompok
      for (let i = 0; i < lakiLaki.length; i++) {
        kelompok[i % jumlahKelompok].lakiLaki.push(lakiLaki[i]);
      }

      // Menambahkan perempuan ke kelompok
      for (let i = 0; i < perempuan.length; i++) {
        kelompok[i % jumlahKelompok].perempuan.push(perempuan[i]);
      }

      // Menyembunyikan form dan menampilkan hasil
      document.querySelector('.card-body').style.display = 'none';
      document.getElementById('copyButton').style.display = 'block';

      let hasilDiv = document.getElementById('hasilKelompok');
      let tabelHTML = `<h3>Hasil Pengelompokan:</h3>`;
      tabelHTML += `<table class="table table-bordered"><thead><tr><th>No</th><th>Kelompok</th><th>Anggota Laki-Laki</th><th>Anggota Perempuan</th></tr></thead><tbody>`;

      kelompok.forEach((kelompok, index) => {
        // Membuat daftar <ul> untuk laki-laki dan perempuan
        let lakiAnggota = `<ul>${kelompok.lakiLaki.map(siswa => `<li>${siswa.nama}</li>`).join('')}</ul>`;
        let perempuanAnggota = `<ul>${kelompok.perempuan.map(siswa => `<li>${siswa.nama}</li>`).join('')}</ul>`;
        tabelHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>Kelompok ${index + 1}</td>
            <td>${lakiAnggota}</td>
            <td>${perempuanAnggota}</td>
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

  document.querySelector('#manual-card form').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah form submit
    
    // Mengambil nama-nama siswa dari textarea
    let lakiLakiNames = document.querySelector('#manual-card textarea:nth-of-type(1)').value.split(',').map(name => name.trim()).filter(name => name.length > 0);
    let perempuanNames = document.querySelector('#manual-card textarea:nth-of-type(2)').value.split(',').map(name => name.trim()).filter(name => name.length > 0);
    let jumlahKelompok = parseInt(document.querySelector('#manual-card input').value);
  
    // Menggabungkan laki-laki dan perempuan dalam satu array
    let semuaNama = lakiLakiNames.concat(perempuanNames);
  
    // Jika jumlah nama tidak cukup untuk dibagi, tampilkan alert
    if (semuaNama.length < jumlahKelompok * 2) {
      alert("Jumlah nama tidak cukup untuk dibagi ke dalam kelompok!");
      return;
    }
  
    // Fungsi untuk mengacak array (Fisher-Yates shuffle)
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
    }
  
    // Mengacak nama-nama laki-laki dan perempuan
    shuffle(lakiLakiNames);
    shuffle(perempuanNames);
  
    // Membuat array kosong untuk kelompok
    let kelompok = [];
    for (let i = 0; i < jumlahKelompok; i++) {
      kelompok[i] = {
        lakiLaki: [],
        perempuan: []
      };
    }
  
    // Membagi laki-laki dan perempuan ke dalam kelompok dengan seimbang
    for (let i = 0; i < lakiLakiNames.length; i++) {
      kelompok[i % jumlahKelompok].lakiLaki.push(lakiLakiNames[i]);
    }
  
    for (let i = 0; i < perempuanNames.length; i++) {
      kelompok[i % jumlahKelompok].perempuan.push(perempuanNames[i]);
    }
  
    // Menyembunyikan form dan menampilkan hasil
    document.querySelector('#manual-card .card-body').style.display = 'none';
    document.getElementById('copyButton').style.display = 'block';
  
    // Menampilkan hasil pengelompokan di dalam tabel
    let hasilDiv = document.getElementById('hasilKelompok');
    let tabelHTML = `<h3>Hasil Pengelompokan:</h3>`;
    tabelHTML += `<table class="table table-bordered"><thead><tr><th>No</th><th>Kelompok</th><th>Anggota Laki-Laki</th><th>Anggota Perempuan</th></tr></thead><tbody>`;
  
    kelompok.forEach((group, index) => {
      let lakiAnggota = `<ul>`;
      group.lakiLaki.forEach(name => {
        lakiAnggota += `<li>${name}</li>`;
      });
      lakiAnggota += `</ul>`;
      
      let perempuanAnggota = `<ul>`;
      group.perempuan.forEach(name => {
        perempuanAnggota += `<li>${name}</li>`;
      });
      perempuanAnggota += `</ul>`;
      
      tabelHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>Kelompok ${index + 1}</td>
          <td>${lakiAnggota}</td>
          <td>${perempuanAnggota}</td>
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
      let lakiAnggota = Array.from(row.cells[2].querySelectorAll('li')).map(li => li.innerText).join('\n');
      let perempuanAnggota = Array.from(row.cells[3].querySelectorAll('li')).map(li => li.innerText).join('\n');
      hasilTabel += `*${kelompokName}*:\n_Laki-Laki_:\n${lakiAnggota}\n_Perempuan_:\n${perempuanAnggota}\n\n`;
    });
  
    navigator.clipboard.writeText(hasilTabel).then(() => {
      alert("Hasil pengelompokan telah disalin ke clipboard!");
    }).catch(err => {
      console.error("Error copying to clipboard:", err);
    });
  });

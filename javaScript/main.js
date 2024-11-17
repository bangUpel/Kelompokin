// File javascript ini digunakan untuk menyimpan fungsi yang diperuntukkan mengubah isi page

let firstPage = document.getElementById("first-page");
let secondPage = document.getElementById("second-page");

secondPage.style.display = "none";

function mulai() 
{
    firstPage.style.display = "none";
    secondPage.style.display = "block";
}
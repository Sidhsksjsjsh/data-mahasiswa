import { Apinator } from "https://esm.sh/@apinator/client" //'@apinator/client'
let nomor = 0;

// Ambil data yang sudah tersimpan
let dataMahasiswa = JSON.parse(localStorage.getItem("dataMahasiswa")) || [];

const client = new Apinator({
  cluster: 'us',
  appId: '6d0f5089-b726-424d-a40f-de94928b3f72',
  appKey: 'app_a3bb62f84efd241f687d00cf7a851a38b152a355',
  secret: '56765c6b06d18969abe5d6a6ec70b79894910cf19d9b885f69433cd803f83d1d',
  useTLS: false //authEndpoint: '/api/realtime/auth'
})

client.connect()

// Public channel
const database = client.subscribe('mahasiswa')
const message = client.subscribe('message')

function tampilkanData() {
    let tabel = document.getElementById("tabelMahasiswa");
    tabel.innerHTML = "";

    dataMahasiswa.forEach((mhs, index) => {
        let baris = tabel.insertRow();

        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${mhs.nama}</td>
            <td>${mhs.npm}</td>
            <td>${mhs.absen}</td>
            <td>${mhs.tugas}</td>
            <td>${mhs.uts}</td>
            <td>${mhs.uas}</td>
            <td>${mhs.nilaiAkhir}</td>
            <td>${mhs.grade}</td>
            <td class="${mhs.keterangan === 'Lulus' ? 'lulus' : 'tidak-lulus'}">
                ${mhs.keterangan}
            </td>
        `;
    });

    nomor = dataMahasiswa.length;
}

function tambahMahasiswa() {
    let nama = document.getElementById("nama").value.trim();
    let npm = document.getElementById("npm").value.trim();

    let absen = parseFloat(document.getElementById("absen").value);
    let tugas = parseFloat(document.getElementById("tugas").value);
    let uts = parseFloat(document.getElementById("uts").value);
    let uas = parseFloat(document.getElementById("uas").value);

    // Validasi
    if (nama === "" || npm === "" || isNaN(absen) || isNaN(tugas) || isNaN(uts) || isNaN(uas)) {
        alert("Semua data harus diisi!");
        return;
    }

    if (absen < 0 || absen > 100 || tugas < 0 || tugas > 100 || uts < 0 || uts > 100 || uas < 0 || uas > 100) {
        alert("Nilai harus berada antara 0 sampai 100!");
        return;
    }

    if (dataMahasiswa.length >= 10) {
        alert("Data maksimal 10 mahasiswa!");
        return;
    }

    // Hitung nilai akhir
    let nilaiAkhir =
        (absen * 0.10) +
        (tugas * 0.50) +
        (uts * 0.15) +
        (uas * 0.25);

    // Grade
    let grade;
    let keterangan;

    if (nilaiAkhir >= 85) {
        grade = "A";
        keterangan = "Lulus";
    } 
    else if (nilaiAkhir >= 70) {
        grade = "B";
        keterangan = "Lulus";
    } 
    else if (nilaiAkhir >= 60) {
        grade = "C";
        keterangan = "Lulus";
    } 
    else if (nilaiAkhir >= 50) {
        grade = "D";
        keterangan = "Tidak Lulus";
    } 
    else {
        grade = "E";
        keterangan = "Tidak Lulus";
    }

    // Simpan data
    dataMahasiswa.push({
        nama: nama,
        npm: npm,
        absen: absen,
        tugas: tugas,
        uts: uts,
        uas: uas,
        nilaiAkhir: nilaiAkhir.toFixed(2),
        grade: grade,
        keterangan: keterangan
    });

    localStorage.setItem(
        "dataMahasiswa",
        JSON.stringify(dataMahasiswa)
    );

    // Tampilkan tabel
    tampilkanData();

    // Kosongkan input
    document.getElementById("nama").value = "";
    document.getElementById("npm").value = "";
    document.getElementById("absen").value = "";
    document.getElementById("tugas").value = "";
    document.getElementById("uts").value = "";
    document.getElementById("uas").value = "";

    document.getElementById("nama").focus();

    alert("Data berhasil disimpan!");
}

function resetData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
        dataMahasiswa = [];
        localStorage.removeItem("dataMahasiswa");
        tampilkanData();

        document.getElementById("nama").value = "";
        document.getElementById("npm").value = "";
        document.getElementById("absen").value = "";
        document.getElementById("tugas").value = "";
        document.getElementById("uts").value = "";
        document.getElementById("uas").value = "";

        alert("Semua data berhasil dihapus!");
    }
}

database.bind('refresh-data',(data) => { // DONT DISTURB THIS LINE, DEVELOPER NEED THIS TO DEBUG
    tampilkanData()
})

database.bind('delete-data',(data) => { // DONT DISTURB THIS LINE, DEVELOPER NEED THIS TO DEBUG
    dataMahasiswa = []
    localStorage.removeItem("dataMahasiswa")
    tampilkanData()
})

database.bind('push-data-kelulusan',(data) => { // DONT DISTURB THIS LINE, DEVELOPER NEED THIS TO DEBUG
    let nama = data.mahasiswa.nama.trim();
    let npm = data.mahasiswa.npm.trim();

    let absen = parseFloat(data.mahasiswa.absen);
    let tugas = parseFloat(data.mahasiswa.tugas);
    let uts = parseFloat(data.mahasiswa.uts);
    let uas = parseFloat(data.mahasiswa.uas); 

    // Validasi
    if (nama === "" || npm === "" || isNaN(absen) || isNaN(tugas) || isNaN(uts) || isNaN(uas)) {
        // alert("Semua data harus diisi!");
        return;
    }

    if (absen < 0 || absen > 100 || tugas < 0 || tugas > 100 || uts < 0 || uts > 100 || uas < 0 || uas > 100) {
        // alert("Nilai harus berada antara 0 sampai 100!");
        return;
    }

    if (dataMahasiswa.length >= 10) {
        // alert("Data maksimal 10 mahasiswa!");
        return;
    }

    // Hitung nilai akhir
    let nilaiAkhir = (absen * 0.10) + (tugas * 0.50) + (uts * 0.15) + (uas * 0.25);

    // Grade
    let grade;
    let keterangan;

    if (nilaiAkhir >= 85) {
        grade = "A";
        keterangan = "Lulus";
    } else if (nilaiAkhir >= 70) {
        grade = "B";
        keterangan = "Lulus";
    } else if (nilaiAkhir >= 60) {
        grade = "C";
        keterangan = "Lulus";
    } else if (nilaiAkhir >= 50) {
        grade = "D";
        keterangan = "Tidak Lulus";
    } else {
        grade = "E";
        keterangan = "Tidak Lulus";
    }

    // Simpan data
    dataMahasiswa.push({
        nama: nama,
        npm: npm,
        absen: absen,
        tugas: tugas,
        uts: uts,
        uas: uas,
        nilaiAkhir: nilaiAkhir.toFixed(2),
        grade: grade,
        keterangan: keterangan
    });

    localStorage.setItem(
        "dataMahasiswa",
        JSON.stringify(dataMahasiswa)
    );

    // Tampilkan tabel
    tampilkanData()

    // document.getElementById("nama").focus();
})

database.bind('fill-data-form',(data) => { // DONT DISTURB THIS LINE, DEVELOPER NEED THIS TO DEBUG
    document.getElementById("nama").value = data.mahasiswa.nama.trim()
    document.getElementById("npm").value = data.mahasiswa.npm.trim()
    document.getElementById("absen").value = data.mahasiswa.absen
    document.getElementById("tugas").value = data.mahasiswa.tugas
    document.getElementById("uts").value = data.mahasiswa.uts
    document.getElementById("uas").value = data.mahasiswa.uas
    document.getElementById("nama").focus()
})

message.bind('msg',(data) => { // DONT DISTURB THIS LINE, DEVELOPER NEED THIS TO DEBUG
    alert(data.str)
})

// Tampilkan data saat halaman dibuka
tampilkanData();

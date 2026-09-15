let nomor = 0;

// Ambil data yang sudah tersimpan
let dataMahasiswa = JSON.parse(localStorage.getItem("dataMahasiswa")) || [];

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
    if (
        nama === "" ||
        npm === "" ||
        isNaN(absen) ||
        isNaN(tugas) ||
        isNaN(uts) ||
        isNaN(uas)
    ) {
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

// Tampilkan data saat halaman dibuka
tampilkanData();

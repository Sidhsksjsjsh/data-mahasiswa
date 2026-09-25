/* ============================================================
   info-panel.js
   Paragraf Info + Statistik Real-time
   ============================================================
   Otomatis memperbarui paragraf & statistik saat isi
   #tabelMahasiswa berubah (MutationObserver).
   
   Cara pakai manual:
       updateInfoPanel();
   ============================================================ */

(function () {
    'use strict';

    /**
     * Update paragraf ringkasan & statistik berdasarkan isi tabel.
     */
    function updateInfoPanel() {
        const tbody = document.getElementById('tabelMahasiswa');
        const text  = document.getElementById('infoText');
        if (!tbody || !text) return;

        const rows = tbody.querySelectorAll('tr');

        // ---------- Empty state ----------
        if (rows.length === 0) {
            text.innerHTML = 'Sistem siap menerima input. Silakan isi formulir di atas untuk memulai rekapitulasi nilai akademik mahasiswa.';
            setStat('statTotal', '0');
            setStat('statLulus', '0');
            setStat('statGagal', '0');
            setStat('statAvg',   '0.00');
            return;
        }

        // ---------- Hitung statistik ----------
        let total = rows.length;
        let lulus = 0;
        let gagal = 0;
        let sum   = 0;
        let maxNilai = 0, maxNama = '-';
        let minNilai = Infinity, minNama = '-';

        rows.forEach(row => {
            const c = row.querySelectorAll('td');
            if (c.length < 10) return;

            const nama  = c[1].textContent.trim();
            const nilai = parseFloat(c[7].textContent.trim()) || 0;
            const ket   = c[9].textContent.trim().toLowerCase();

            sum += nilai;

            if (ket.includes('tidak lulus')) {
                gagal++;
            } else if (ket.includes('lulus')) {
                lulus++;
            }

            if (nilai > maxNilai) { maxNilai = nilai; maxNama = nama; }
            if (nilai < minNilai) { minNilai = nilai; minNama = nama; }
        });

        const avg = (sum / total).toFixed(2);
        const pct = ((lulus / total) * 100).toFixed(1);

        // ---------- Render paragraf ----------
        text.innerHTML = `Terdapat <strong>${total} mahasiswa</strong> dalam sistem dengan rata-rata nilai akhir <em>${avg}</em>. Sebanyak <strong>${lulus} mahasiswa (${pct}%)</strong> dinyatakan <em>lulus</em>, sementara <strong>${gagal} mahasiswa</strong> belum memenuhi kriteria. Nilai tertinggi diraih oleh <em>${maxNama}</em> dengan skor <strong>${maxNilai}</strong>, dan nilai terendah oleh <em>${minNama}</em> dengan skor <strong>${minNilai}</strong>.`;

        // ---------- Update stat boxes ----------
        setStat('statTotal', total);
        setStat('statLulus', lulus);
        setStat('statGagal', gagal);
        setStat('statAvg',   avg);
    }

    function setStat(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // ---------- Auto-update: observe tabel ----------
    document.addEventListener('DOMContentLoaded', () => {
        const tbody = document.getElementById('tabelMahasiswa');
        if (!tbody) return;

        const obs = new MutationObserver(updateInfoPanel);
        obs.observe(tbody, { childList: true, subtree: true });

        // Initial render
        updateInfoPanel();
    });

    // Expose ke global
    window.updateInfoPanel = updateInfoPanel;
})();
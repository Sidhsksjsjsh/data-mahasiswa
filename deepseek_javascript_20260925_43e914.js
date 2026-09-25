/* ============================================================
   popup.js
   Custom Popup Modal — Tema Gold + Cyan
   ============================================================
   Cara pakai:
       openPopup({
           title: 'Judul',
           message: 'Pesan popup',
           variant: 'danger',     // 'default' | 'danger' | 'success'
           okText: 'Ya',
           cancelText: 'Batal',   // null = sembunyikan tombol cancel
           onOk: () => { ... }
       });
   
   Tutup: klik tombol, klik luar, atau tekan ESC.
   ============================================================ */

(function () {
    'use strict';

    const ICONS = {
        default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    };

    let _onOkCallback = null;

    /**
     * Buka popup custom.
     * @param {Object} opts
     * @param {string} opts.title         - Judul (boleh pakai HTML)
     * @param {string} opts.message       - Pesan
     * @param {string} [opts.variant]     - 'default'|'danger'|'success'
     * @param {string} [opts.okText]      - Teks tombol OK
     * @param {string|null} [opts.cancelText] - Teks tombol Cancel (null = hide)
     * @param {Function} [opts.onOk]      - Callback saat OK
     */
    function openPopup(opts) {
        const {
            title = 'Konfirmasi',
            message = '',
            variant = 'default',
            okText = 'OK',
            cancelText = 'Batal',
            onOk = null
        } = opts || {};

        const mask = document.getElementById('popupMask');
        const box  = document.getElementById('popupBox');
        const icon = document.getElementById('popupIcon');
        const btnCancel = document.getElementById('popupCancel');

        if (!mask || !box) {
            console.warn('[openPopup] Elemen #popupMask / #popupBox tidak ditemukan.');
            return;
        }

        // Set variant class
        box.className = 'popup' + (variant !== 'default' ? ' ' + variant : '');

        // Set konten
        document.getElementById('popupTitle').innerHTML = title;
        document.getElementById('popupMsg').textContent = message;
        document.getElementById('popupOk').textContent = okText;

        // Icon
        icon.innerHTML = ICONS[variant] || ICONS.default;

        // Cancel button
        if (cancelText === null) {
            btnCancel.style.display = 'none';
        } else {
            btnCancel.style.display = '';
            btnCancel.textContent = cancelText;
        }

        _onOkCallback = onOk;
        mask.classList.add('show');
    }

    function closePopup() {
        const mask = document.getElementById('popupMask');
        if (mask) mask.classList.remove('show');
        _onOkCallback = null;
    }

    // Bind event listener sekali saat DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        const mask = document.getElementById('popupMask');
        const btnCancel = document.getElementById('popupCancel');
        const btnOk = document.getElementById('popupOk');

        if (!mask || !btnCancel || !btnOk) return;

        btnCancel.addEventListener('click', closePopup);

        btnOk.addEventListener('click', () => {
            const cb = _onOkCallback;
            closePopup();
            if (typeof cb === 'function') cb();
        });

        mask.addEventListener('click', (e) => {
            if (e.target === mask) closePopup();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mask.classList.contains('show')) {
                closePopup();
            }
        });
    });

    // Expose ke global
    window.openPopup  = openPopup;
    window.closePopup = closePopup;
})();
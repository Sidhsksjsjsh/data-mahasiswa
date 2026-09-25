/* ============================================================
   notifikasi.js
   Custom Toast Notification — Tema Gold + Cyan
   ============================================================
   Cara pakai:
       notify('Judul', 'Pesan', 'success');
       notify('Judul', 'Pesan', 'error', 6000);
   
   Tipe yang tersedia: 'success' | 'error' | 'warn' | 'info'
   ============================================================ */

(function () {
    'use strict';

    const ICONS = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warn:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const DEFAULT_DURATION = 4500;

    /**
     * Tampilkan notifikasi custom.
     * @param {string} title      - Judul notifikasi
     * @param {string} message    - Isi pesan
     * @param {string} [type]     - 'success'|'error'|'warn'|'info'
     * @param {number} [duration] - Durasi dalam ms
     */
    function notify(title, message, type = 'info', duration = DEFAULT_DURATION) {
        const stack = document.getElementById('notifStack');
        if (!stack) {
            console.warn('[notify] Container #notifStack tidak ditemukan.');
            return;
        }

        const el = document.createElement('div');
        el.className = `notif type-${type}`;
        el.innerHTML = `
            <div class="notif-icon">${ICONS[type] || ICONS.info}</div>
            <div class="notif-body">
                <h5>${title}</h5>
                <p>${message}</p>
            </div>
            <button class="notif-x" aria-label="Tutup">×</button>
            <div class="notif-bar" style="animation-duration:${duration}ms"></div>
        `;
        stack.appendChild(el);

        let timer = null;
        let dismissed = false;

        function dismiss() {
            if (dismissed) return;
            dismissed = true;
            if (timer) clearTimeout(timer);
            el.classList.add('exit');
            setTimeout(() => el.remove(), 400);
        }

        el.querySelector('.notif-x').addEventListener('click', dismiss);
        timer = setTimeout(dismiss, duration);

        // Pause saat hover
        el.addEventListener('mouseenter', () => {
            if (timer) clearTimeout(timer);
            const bar = el.querySelector('.notif-bar');
            if (bar) bar.style.animationPlayState = 'paused';
        });
        el.addEventListener('mouseleave', () => {
            if (dismissed) return;
            timer = setTimeout(dismiss, 1500);
            const bar = el.querySelector('.notif-bar');
            if (bar) bar.style.animationPlayState = 'running';
        });
    }

    // Expose ke global
    window.notify = notify;
})();
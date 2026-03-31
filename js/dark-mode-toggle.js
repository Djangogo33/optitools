/**
 * dark-mode-toggle.js — TutoFacile
 * Fix: apply dark mode BEFORE render to avoid flash, persist across pages
 */
(function () {
  'use strict';

  const KEY = 'tutofacile_dark_mode';
  const HTML = document.documentElement;

  // ── Apply immediately (before paint) to avoid flash ──────────────────
  if (localStorage.getItem(KEY) === 'true') {
    HTML.classList.add('dark-mode');
  }

  function updateToggleIcon(isDark) {
    const btn = document.getElementById('dark-mode-toggle');
    if (btn) btn.textContent = isDark ? '🌙' : '💡';
  }

  function initDarkModeToggle() {
    const btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;

    const isDark = HTML.classList.contains('dark-mode');
    updateToggleIcon(isDark);

    btn.addEventListener('click', () => {
      const nowDark = HTML.classList.toggle('dark-mode');
      localStorage.setItem(KEY, nowDark);
      updateToggleIcon(nowDark);

      // Dispatch event so other scripts can react
      document.dispatchEvent(new CustomEvent('darkModeChanged', { detail: { dark: nowDark } }));
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkModeToggle);
  } else {
    initDarkModeToggle();
  }
})();

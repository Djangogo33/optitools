/**
 * language-selector.js — TutoFacile
 * Fix: translate ALL data-i18n elements including dynamically added ones,
 *      fix button active state, fix placeholder updates
 */
(function () {
  'use strict';

  const KEY = 'siteLang';
  const SUPPORTED = ['fr', 'en'];

  function getLang() {
    const stored = localStorage.getItem(KEY);
    if (SUPPORTED.includes(stored)) return stored;
    // Detect browser language
    const browser = (navigator.language || 'fr').substring(0, 2);
    return SUPPORTED.includes(browser) ? browser : 'fr';
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateButtons(lang);

    // Notify other modules
    document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));

    // Re-render dynamic content
    if (typeof window.displayTutos === 'function') window.displayTutos();
    if (typeof window.loadLatestTutos === 'function') window.loadLatestTutos();
    if (typeof window.loadPopularTutos === 'function') window.loadPopularTutos();
  }

  function applyTranslations(lang) {
    if (!window.translations || !window.translations[lang]) return;
    const t = window.translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t[key];
      if (text === undefined) return;

      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        el.placeholder = text;
      } else if (tag === 'BUTTON') {
        // Preserve leading emoji if present
        const match = el.textContent.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\s)*/u);
        const emoji = match ? match[0] : '';
        el.textContent = emoji + text;
      } else {
        el.innerHTML = text;
      }
    });
  }

  function updateButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', btnLang === lang);
      btn.setAttribute('aria-pressed', btnLang === lang);
    });
  }

  function bindButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      // Avoid double-binding
      if (btn.dataset.langBound) return;
      btn.dataset.langBound = '1';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  function init() {
    const lang = getLang();
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateButtons(lang);
    bindButtons();

    // Also expose globally for compatibility with inline scripts
    window.t = function (key) {
      const l = getLang();
      return window.translations?.[l]?.[key] ?? key;
    };
    window.updateAllTranslations = function () {
      const l = getLang();
      applyTranslations(l);
      updateButtons(l);
    };
    window.setLang = setLang;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

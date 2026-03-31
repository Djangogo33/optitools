/**
 * promo-banner.js — TutoFacile
 * Bandeau de promotion croisée : About Me, Discord, WhatsApp, AITools Extension
 * S'injecte automatiquement sur toutes les pages. Respecte le dark mode.
 * Peut être fermé et se souvient du choix pendant 7 jours.
 */
(function () {
  'use strict';

  const DISMISSED_KEY = 'tutofacile_promo_dismissed';
  const DISMISSED_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

  function isDismissed() {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return false;
    try {
      const { ts } = JSON.parse(raw);
      return Date.now() - ts < DISMISSED_EXPIRY;
    } catch { return false; }
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify({ ts: Date.now() }));
    const banner = document.getElementById('tf-promo-banner');
    if (banner) banner.style.display = 'none';
  }

  function injectBanner() {
    if (isDismissed()) return;

    const isDark = document.documentElement.classList.contains('dark-mode');

    const banner = document.createElement('div');
    banner.id = 'tf-promo-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Promotions communauté');

    banner.innerHTML = `
      <style>
        #tf-promo-banner {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 9999;
          background: linear-gradient(90deg, #0f1117 0%, #1a1a2e 100%);
          color: #f0f0f0;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          border-top: 2px solid #0066ff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: .9rem;
          box-shadow: 0 -4px 20px rgba(0,0,0,.4);
          animation: slideUpBanner .4s ease-out;
        }
        @keyframes slideUpBanner {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        #tf-promo-banner .promo-label {
          font-weight: 700;
          color: #00d9a3;
          white-space: nowrap;
        }
        #tf-promo-banner .promo-links {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        #tf-promo-banner .promo-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 600;
          text-decoration: none;
          font-size: .85rem;
          transition: all .2s;
          border: 1.5px solid transparent;
          cursor: pointer;
          white-space: nowrap;
        }
        #tf-promo-banner .promo-link:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.3); }
        #tf-promo-banner .promo-link-discord { background: #5865F2; color: white; }
        #tf-promo-banner .promo-link-whatsapp { background: #25d366; color: white; }
        #tf-promo-banner .promo-link-extension { background: #ea4335; color: white; }
        #tf-promo-banner .promo-link-aboutme { background: transparent; color: #00d9a3; border-color: #00d9a3; }
        #tf-promo-banner .promo-close {
          margin-left: auto;
          background: none;
          border: 1px solid #555;
          color: #aaa;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: .8rem;
          transition: .2s;
          flex-shrink: 0;
        }
        #tf-promo-banner .promo-close:hover { border-color: #f0f0f0; color: #f0f0f0; }
        @media (max-width: 600px) {
          #tf-promo-banner { padding: 10px 12px; font-size: .82rem; }
          #tf-promo-banner .promo-label { display: none; }
        }
      </style>
      <span class="promo-label">🎯 Rejoignez l'écosystème :</span>
      <div class="promo-links">
        <a class="promo-link promo-link-discord"
           href="https://discord.gg/J2ssa2Wkjr" target="_blank" rel="noopener">
          💬 Discord
        </a>
        <a class="promo-link promo-link-whatsapp"
           href="https://whatsapp.com/channel/0029VbCJCg06GcG7aLZPGu1f" target="_blank" rel="noopener">
          📱 WhatsApp
        </a>
        <a class="promo-link promo-link-extension"
           href="https://chromewebstore.google.com/detail/aitools" target="_blank" rel="noopener">
          🧩 Extension AITools
        </a>
        <a class="promo-link promo-link-aboutme"
           href="https://djangogo33.github.io/about-me" target="_blank" rel="noopener">
          👤 About Me
        </a>
      </div>
      <button class="promo-close" onclick="(function(){localStorage.setItem('tutofacile_promo_dismissed',JSON.stringify({ts:Date.now()}));document.getElementById('tf-promo-banner').style.display='none';})()">
        ✕ Fermer
      </button>
    `;

    document.body.appendChild(banner);

    // Update if dark mode changes
    document.addEventListener('darkModeChanged', (e) => {
      // Banner has its own dark style, no action needed
    });
  }

  // Inject after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBanner);
  } else {
    injectBanner();
  }
})();

/**
 * PROMO-INJECTOR.JS
 * Auto-inject cross-project promotional bars between AITools and TutoFacile
 * Works automatically on DOMContentLoaded
 */

const PROMO_CONFIG = {
  // Auto-detect current project
  getCurrentProject() {
    const url = window.location.href.toLowerCase();
    if (url.includes('aitools') || url.includes('chrome')) return 'aitools';
    if (url.includes('tutofacile') || url.includes('tuto')) return 'tutofacile';
    return 'unknown';
  },

  // Create promotional bar HTML
  createPromoBar(project) {
    if (project === 'aitools') {
      // Promo for TutoFacile (showing on AITools)
      return `
        <div class="promo-bar" id="promo-bar-tutofacile" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          animation: slideDown 0.4s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 24px;">📚</span>
            <div>
              <strong style="font-size: 14px; display: block;">Découvrez TutoFacile</strong>
              <span style="font-size: 12px; opacity: 0.9;">50+ tutoriels gratuits en bricolage, cuisine, code et jardinage</span>
            </div>
          </div>
          <a href="https://tutofacile.netlify.app/" target="_blank" style="
            background: white;
            color: #667eea;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            white-space: nowrap;
            margin: 0 12px;
            cursor: pointer;
            transition: all 0.3s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Visiter
          </a>
          <button onclick="document.getElementById('promo-bar-tutofacile').style.display='none'" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 3px;
            transition: all 0.3s;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            ✕
          </button>
        </div>
        <style>
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
      `;
    } else if (project === 'tutofacile') {
      // Promo for AITools (showing on TutoFacile)
      return `
        <div class="promo-bar" id="promo-bar-aitools" style="
          background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%);
          color: white;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          animation: slideDown 0.4s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 24px;">⚡</span>
            <div>
              <strong style="font-size: 14px; display: block;">Essayez AITools</strong>
              <span style="font-size: 12px; opacity: 0.9;">Extension Chrome gratuite: Antidote IA, Antipub, Weaver, Privacy Tools & plus</span>
            </div>
          </div>
          <a href="https://chrome.google.com/webstore/detail/aitools/" target="_blank" style="
            background: white;
            color: #0066FF;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            white-space: nowrap;
            margin: 0 12px;
            cursor: pointer;
            transition: all 0.3s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Installer
          </a>
          <button onclick="document.getElementById('promo-bar-aitools').style.display='none'" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 3px;
            transition: all 0.3s;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            ✕
          </button>
        </div>
        <style>
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
      `;
    }
    return '';
  },

  // Inject promotional bar into page
  injectPromo() {
    const project = this.getCurrentProject();
    if (project === 'unknown') return; // Don't inject if we can't detect project

    const promoHTML = this.createPromoBar(project);
    if (!promoHTML) return;

    // Insert at the very top of body
    const bodyFirst = document.body.firstChild;
    const promoDiv = document.createElement('div');
    promoDiv.innerHTML = promoHTML;
    document.body.insertBefore(promoDiv.firstElementChild, bodyFirst);
  },

  // Initialize on DOM ready
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectPromo());
    } else {
      this.injectPromo();
    }
  }
};

// Auto-start on script load
PROMO_CONFIG.init();

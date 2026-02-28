<!-- Cross-Project Promotions v1.0 -->
<script>
  // Configuration des projets
  const PROJECTS = {
    aitools: {
      name: 'AITools',
      description: 'Suite d\'outils IA: Détection, Anonymisation, Blocage de pubs',
      url: 'https://chrome.google.com/webstore/detail/aitools',
      icon: '🤖',
      color: '#667eea'
    },
    tutofacile: {
      name: 'TutoFacile',
      description: 'Tutoriels web gratuits et faciles à comprendre',
      url: 'https://tutofacile.com',
      icon: '📚',
      color: '#06b6d4'
    }
  };
  
  // Déterminer le projet actuel
  function getCurrentProject() {
    const host = window.location.hostname;
    if (host.includes('tutofacile') || host === 'localhost') return 'tutofacile';
    if (host.includes('chrome') || document.title.includes('AITools')) return 'aitools';
    return null;
  }
  
  // Obtenir les projets à promouvoir (tous sauf le courant)
  function getProjectsToPromote() {
    const current = getCurrentProject();
    return Object.entries(PROJECTS)
      .filter(([key]) => key !== current)
      .map(([, project]) => project);
  }
  
  // Créer une bannière de pub
  function createPromoBar(project) {
    const html = `
      <div class="promo-bar" style="
        background: linear-gradient(135deg, ${project.color}, ${project.color}dd);
        padding: 12px 20px;
        margin: 15px 0;
        border-radius: 8px;
        border-left: 4px solid ${project.color};
        color: white;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
      ">
        <div>
          <strong>${project.icon} ${project.name}</strong><br>
          <span style="font-size: 13px; opacity: 0.9;">${project.description}</span>
        </div>
        <a href="${project.url}" style="
          background: white;
          color: ${project.color};
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          white-space: nowrap;
          border: none;
          cursor: pointer;
        ">Découvrir →</a>
      </div>
    `;
    return html;
  }
  
  // Injecter les pubs
  window.injectProjectPromos = function(containerId = 'promo-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('[Promos] Container not found:', containerId);
      return;
    }
    
    const projects = getProjectsToPromote();
    const html = projects.map(createPromoBar).join('');
    container.innerHTML += html;
    console.log('[Promos] Injected', projects.length, 'promotions');
  };
  
  // Auto-inject if container exists
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('promo-container')) {
      window.injectProjectPromos('promo-container');
    }
  });
</script>

<style>
  .promo-bar {
    animation: slideIn 0.5s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .promo-bar a:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
  }
</style>

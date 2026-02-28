// ============ FAVORITES/BOOKMARKS SYSTEM ============
// Save and manage favorite tutorials

const FAVORITES_KEY = 'tutofacile_favorites';
const MAX_FAVORITES = 50;

// Initialize favorites system
function initFavoritesSystem() {
  // Add favorite button to each card
  document.querySelectorAll('.tuto-card').forEach(card => {
    const tutoId = card.dataset.tutoId || extractTutoIdFromUrl(card.href);
    if (!tutoId) return;
    
    const favBtn = document.createElement('button');
    favBtn.className = 'favorite-btn';
    favBtn.innerHTML = '🤍';
    favBtn.setAttribute('data-tuto-id', tutoId);
    favBtn.title = 'Ajouter aux favoris';
    
    // Check if already favorited
    if (isFavorited(tutoId)) {
      favBtn.classList.add('favorited');
      favBtn.innerHTML = '❤️';
    }
    
    favBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(tutoId, favBtn);
    });
    
    card.appendChild(favBtn);
  });
}

function extractTutoIdFromUrl(url) {
  const match = url.match(/id=(\d+)/);
  return match ? match[1] : null;
}

function toggleFavorite(tutoId, btn) {
  const favorites = getFavorites();
  
  if (favorites.includes(tutoId)) {
    // Remove from favorites
    const index = favorites.indexOf(tutoId);
    favorites.splice(index, 1);
    btn.innerHTML = '🤍';
    btn.classList.remove('favorited');
    showToast('❌ Retiré des favoris', 'info');
  } else {
    // Add to favorites
    if (favorites.length >= MAX_FAVORITES) {
      showToast('⚠️ Maximum 50 favoris atteint', 'warning');
      return;
    }
    favorites.push(tutoId);
    btn.innerHTML = '❤️';
    btn.classList.add('favorited');
    showToast('❤️ Ajouté aux favoris!', 'success');
  }
  
  saveFavorites(favorites);
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorited(tutoId) {
  return getFavorites().includes(String(tutoId));
}

function displayFavorites() {
  const favorites = getFavorites();
  if (favorites.length === 0) {
    return '<p style="text-align: center; padding: 40px; color: #999;">Aucun favori pour le moment</p>';
  }
  
  // This would fetch tuto details from data.json
  return favorites.map(id => `<div class="fav-item" data-id="${id}">Tuto ${id}</div>`).join('');
}

// Show favorites section
window.showFavorites = function() {
  const favoritesHtml = displayFavorites();
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>❤️ Mes Favoris</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-content">
        ${favoritesHtml}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

// Add CSS for favorites
const style = document.createElement('style');
style.textContent = `
  .favorite-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .favorite-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .favorite-btn.favorited {
    background: #ffe5e5;
    border-color: #ec4899;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
    position: sticky;
    top: 0;
    background: white;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
  }
  
  .modal-content {
    padding: 20px;
  }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', initFavoritesSystem);

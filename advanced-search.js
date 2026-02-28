// ============ ADVANCED SEARCH SYSTEM ============
// Full-text search, filters, sorting

class SearchEngine {
  constructor() {
    this.allTutos = [];
    this.searchResults = [];
    this.filters = {
      category: 'all',
      difficulty: 'all',
      maxTime: 120
    };
    this.init();
  }
  
  init() {
    this.loadTutos();
    this.setupSearchUI();
  }
  
  async loadTutos() {
    try {
      const response = await fetch('data.json');
      this.allTutos = await response.json();
      this.indexTutos();
    } catch (e) {
      console.error('Failed to load tutos:', e);
    }
  }
  
  indexTutos() {
    // Create searchable index for each tutorial
    this.index = this.allTutos.map(tuto => ({
      ...tuto,
      searchText: `${tuto.titre} ${tuto.description} ${tuto.categorie}`.toLowerCase()
    }));
  }
  
  search(query) {
    if (!query.trim()) {
      this.searchResults = this.allTutos;
      return this.searchResults;
    }
    
    const q = query.toLowerCase();
    
    // Tokenize query for better matching
    const tokens = q.split(/\s+/).filter(t => t.length > 2);
    
    this.searchResults = this.index.filter(tuto => {
      // Check if all tokens exist in search text
      const textMatch = tokens.every(token => tuto.searchText.includes(token));
      
      // Apply filters
      const categoryMatch = this.filters.category === 'all' || tuto.categorie === this.filters.category;
      const difficultyMatch = this.filters.difficulty === 'all' || tuto.difficulty === this.filters.difficulty;
      const timeMatch = tuto.time <= this.filters.maxTime;
      
      return textMatch && categoryMatch && difficultyMatch && timeMatch;
    });
    
    // Sort by relevance
    this.sortResults(q);
    
    return this.searchResults;
  }
  
  sortResults(query) {
    const q = query.toLowerCase();
    
    this.searchResults.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      // Exact title match gets high score
      if (a.titre.toLowerCase() === q) scoreA += 1000;
      if (b.titre.toLowerCase() === q) scoreB += 1000;
      
      // Title contains query
      if (a.titre.toLowerCase().includes(q)) scoreA += 500;
      if (b.titre.toLowerCase().includes(q)) scoreB += 500;
      
      // Description contains query
      if (a.description.toLowerCase().includes(q)) scoreA += 100;
      if (b.description.toLowerCase().includes(q)) scoreB += 100;
      
      return scoreB - scoreA;
    });
  }
  
  setupSearchUI() {
    const searchInput = document.getElementById('search-input');
    const advancedFiltersBtn = document.getElementById('advanced-filters-btn');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const results = this.search(e.target.value);
        this.displayResults(results);
      });
    }
    
    if (advancedFiltersBtn) {
      advancedFiltersBtn.addEventListener('click', () => {
        this.showAdvancedFilters();
      });
    }
  }
  
  displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">Aucun résultat trouvé</p>';
      return;
    }
    
    const html = results.map(t => `
      <a href="${t.url || `tuto-viewer.html?id=${t.id}`}" class="search-result-item">
        <strong>${t.titre}</strong>
        <small>${t.categorie} • ${t.time}min • ${t.difficulty}</small>
        <p>${t.description.substring(0, 80)}...</p>
      </a>
    `).join('');
    
    resultsContainer.innerHTML = html;
  }
  
  showAdvancedFilters() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>🔍 Filtres Avancés</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-content">
          <div class="filter-group">
            <label>📁 Catégorie:</label>
            <select id="filter-category">
              <option value="all">Toutes</option>
              <option value="Bricolage">Bricolage</option>
              <option value="Cuisine">Cuisine</option>
              <option value="Code">Code</option>
              <option value="Jardinage">Jardinage</option>
              <option value="Bien-être">Bien-être</option>
              <option value="Électronique">Électronique</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>📊 Difficulté:</label>
            <select id="filter-difficulty">
              <option value="all">Toutes</option>
              <option value="Facile">Facile</option>
              <option value="Moyen">Moyen</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>⏱️ Durée max (min):</label>
            <input type="range" id="filter-time" min="5" max="120" value="120" step="5">
            <span id="time-display">120 min</span>
          </div>
          
          <button class="btn-primary" onclick="searchEngine.applyFilters()">Appliquer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set current filter values
    document.getElementById('filter-category').value = this.filters.category;
    document.getElementById('filter-difficulty').value = this.filters.difficulty;
    document.getElementById('filter-time').value = this.filters.maxTime;
    
    // Update time display
    document.getElementById('filter-time').addEventListener('input', (e) => {
      document.getElementById('time-display').textContent = e.target.value + ' min';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
  
  applyFilters() {
    this.filters.category = document.getElementById('filter-category').value;
    this.filters.difficulty = document.getElementById('filter-difficulty').value;
    this.filters.maxTime = parseInt(document.getElementById('filter-time').value);
    
    const query = document.getElementById('search-input').value;
    const results = this.search(query);
    this.displayResults(results);
    
    // Close modal
    document.querySelector('.modal-overlay').remove();
    showToast('✅ Filtres appliqués', 'success');
  }
}

// Initialize search engine
let searchEngine;
document.addEventListener('DOMContentLoaded', () => {
  searchEngine = new SearchEngine();
});

// Add search styles
const searchStyle = document.createElement('style');
searchStyle.textContent = `
  .search-result-item {
    display: block;
    padding: 12px;
    margin: 8px 0;
    border-radius: 6px;
    background: #f9f9f9;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
    border-left: 4px solid var(--primary);
  }
  
  .search-result-item:hover {
    background: #f0f0f0;
    transform: translateX(4px);
  }
  
  .search-result-item strong {
    display: block;
    color: var(--primary);
    margin-bottom: 4px;
  }
  
  .search-result-item small {
    display: block;
    color: #999;
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .search-result-item p {
    margin: 0;
    font-size: 13px;
    color: #666;
  }
  
  .filter-group {
    margin-bottom: 20px;
  }
  
  .filter-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--primary);
  }
  
  .filter-group select,
  .filter-group input[type="range"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }
  
  #time-display {
    display: inline-block;
    margin-left: 10px;
    color: var(--primary);
    font-weight: bold;
  }
`;
document.head.appendChild(searchStyle);

// ============ INTELLIGENT RECOMMENDATIONS ENGINE ============
// ML-based suggestions based on user behavior

class RecommendationEngine {
  constructor() {
    this.userProfile = {};
    this.viewHistory = [];
    this.ratings = {};
    this.loadUserData();
  }
  
  loadUserData() {
    try {
      this.viewHistory = JSON.parse(localStorage.getItem('tutofacile_view_history') || '[]');
      this.ratings = JSON.parse(localStorage.getItem('tutofacile_ratings') || '{}');
    } catch (e) {
      console.debug('Could not load user data');
    }
  }
  
  trackView(tutoId) {
    const now = Date.now();
    this.viewHistory.push({ tutoId, timestamp: now });
    
    // Keep only last 100 views
    if (this.viewHistory.length > 100) {
      this.viewHistory.shift();
    }
    
    localStorage.setItem('tutofacile_view_history', JSON.stringify(this.viewHistory));
  }
  
  trackRating(tutoId, rating) {
    this.ratings[tutoId] = rating;
    localStorage.setItem('tutofacile_ratings', JSON.stringify(this.ratings));
  }
  
  getRecommendations(allTutos, count = 5) {
    if (this.viewHistory.length === 0) {
      // Return popular tutorials if no history
      return allTutos.slice(0, count);
    }
    
    // Analyze user preferences
    const preferences = this.analyzePreferences(allTutos);
    
    // Score each tutorial
    const scored = allTutos.map(tuto => ({
      ...tuto,
      score: this.calculateScore(tuto, preferences, allTutos)
    }));
    
    // Filter out already viewed
    const viewed = new Set(this.viewHistory.map(v => v.tutoId));
    const unviewed = scored.filter(t => !viewed.has(t.id));
    
    // Sort by score and return top N
    return unviewed
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }
  
  analyzePreferences(allTutos) {
    const categories = {};
    const difficulties = {};
    const times = [];
    
    for (const view of this.viewHistory) {
      const tuto = allTutos.find(t => t.id == view.tutoId);
      if (tuto) {
        // Category preference
        categories[tuto.categorie] = (categories[tuto.categorie] || 0) + 1;
        
        // Difficulty preference
        difficulties[tuto.difficulty] = (difficulties[tuto.difficulty] || 0) + 1;
        
        // Time preference
        times.push(tuto.time);
      }
    }
    
    return {
      categories,
      difficulties,
      averageTime: times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 30,
      topCategory: Object.entries(categories).sort(([, a], [, b]) => b - a)[0]?.[0] || 'Code',
      topDifficulty: Object.entries(difficulties).sort(([, a], [, b]) => b - a)[0]?.[0] || 'Facile'
    };
  }
  
  calculateScore(tuto, preferences, allTutos) {
    let score = 0;
    
    // Category match (40%)
    if (preferences.categories[tuto.categorie]) {
      score += preferences.categories[tuto.categorie] * 10;
    }
    
    // Difficulty match (25%)
    const difficultyMatch = {
      'Facile': 1,
      'Moyen': 2,
      'Difficile': 3
    };
    const userDiff = difficultyMatch[preferences.topDifficulty] || 2;
    const tutoDiff = difficultyMatch[tuto.difficulty] || 2;
    score += Math.max(0, 50 - Math.abs(userDiff - tutoDiff) * 10);
    
    // Time match (20%)
    const timeDiff = Math.abs(tuto.time - preferences.averageTime);
    score += Math.max(0, 30 - timeDiff);
    
    // Rating boost (15%)
    if (this.ratings[tuto.id]) {
      score += this.ratings[tuto.id] * 3;
    }
    
    // Collaborative filtering (related tutorials)
    const related = this.findRelatedTutorials(tuto, allTutos);
    if (related.length > 0) {
      const viewedRelated = related.filter(r => 
        this.viewHistory.some(v => v.tutoId == r.id)
      );
      if (viewedRelated.length > 0) {
        score += 20;
      }
    }
    
    return score;
  }
  
  findRelatedTutorials(tuto, allTutos) {
    return allTutos.filter(t => 
      t.id !== tuto.id && 
      (t.categorie === tuto.categorie || 
       t.difficulty === tuto.difficulty)
    );
  }
  
  getSimilarTutorials(tutoId, allTutos, count = 4) {
    const currentTuto = allTutos.find(t => t.id == tutoId);
    if (!currentTuto) return [];
    
    const similar = allTutos
      .filter(t => t.id !== tutoId)
      .map(t => ({
        ...t,
        similarity: this.calculateSimilarity(currentTuto, t)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count);
    
    return similar;
  }
  
  calculateSimilarity(tuto1, tuto2) {
    let similarity = 0;
    
    // Same category (50%)
    if (tuto1.categorie === tuto2.categorie) similarity += 50;
    
    // Similar difficulty (30%)
    if (tuto1.difficulty === tuto2.difficulty) similarity += 30;
    
    // Similar time (20%)
    if (Math.abs(tuto1.time - tuto2.time) <= 10) similarity += 20;
    
    return similarity;
  }
  
  displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    if (recommendations.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">Aucune recommandation</p>';
      return;
    }
    
    const html = `
      <h2 style="margin-bottom: 15px;">💡 Recommandé pour vous</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
        ${recommendations.map(t => `
          <div class="recommendation-card">
            <div class="recommendation-header">
              <span class="recommendation-score">📊 ${Math.round(t.score)}%</span>
            </div>
            <h3>${t.titre}</h3>
            <p>${t.description.substring(0, 60)}...</p>
            <div class="recommendation-meta">
              <span>${t.categorie}</span>
              <span>${t.time}min</span>
              <span>${t.difficulty}</span>
            </div>
            <a href="tuto-viewer.html?id=${t.id}" class="btn-primary" style="width: 100%; margin-top: 10px;">
              Voir le tuto
            </a>
          </div>
        `).join('')}
      </div>
    `;
    
    container.innerHTML = html;
  }
}

// Add styles for recommendations
const recStyle = document.createElement('style');
recStyle.textContent = `
  .recommendation-card {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border-top: 3px solid var(--primary);
  }
  
  .recommendation-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .recommendation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .recommendation-score {
    display: inline-block;
    background: var(--accent);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .recommendation-card h3 {
    margin: 10px 0;
    color: var(--primary);
    font-size: 16px;
  }
  
  .recommendation-card p {
    font-size: 13px;
    color: #666;
    margin: 8px 0;
    line-height: 1.4;
  }
  
  .recommendation-meta {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: #999;
    margin: 10px 0;
    flex-wrap: wrap;
  }
  
  .recommendation-meta span {
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  #recommendations-container {
    margin: 30px 0;
    padding: 20px;
    background: linear-gradient(135deg, rgba(102, 51, 153, 0.05), rgba(255, 102, 0, 0.05));
    border-radius: 8px;
  }
`;
document.head.appendChild(recStyle);

// Initialize when tuto-viewer loads
let recommendationEngine;
document.addEventListener('DOMContentLoaded', () => {
  recommendationEngine = new RecommendationEngine();
  
  // Track view if on tuto-viewer page
  const urlParams = new URLSearchParams(window.location.search);
  const tutoId = urlParams.get('id');
  if (tutoId) {
    recommendationEngine.trackView(parseInt(tutoId));
  }
});

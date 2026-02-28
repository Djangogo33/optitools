// ============ GAMIFICATION & ACHIEVEMENTS SYSTEM ============
// Badges, streaks, points, level progression

class GamificationEngine {
  constructor() {
    this.achievements = this.defineAchievements();
    this.userProfile = {
      points: 0,
      level: 1,
      streak: 0,
      lastVisit: Date.now(),
      unlockedAchievements: [],
      totalViews: 0,
      totalRatings: 0,
      totalFavorites: 0
    };
    this.loadUserProfile();
  }
  
  defineAchievements() {
    return {
      'first_view': {
        id: 'first_view',
        name: '👀 Première Vue',
        description: 'Regarder votre premier tutoriel',
        icon: '👀',
        points: 10,
        condition: (profile) => profile.totalViews >= 1
      },
      'view_10': {
        id: 'view_10',
        name: '🎯 Spectateur Régulier',
        description: 'Regarder 10 tutoriels',
        icon: '🎯',
        points: 50,
        condition: (profile) => profile.totalViews >= 10
      },
      'view_50': {
        id: 'view_50',
        name: '🔥 Étudiant Assidu',
        description: 'Regarder 50 tutoriels',
        icon: '🔥',
        points: 200,
        condition: (profile) => profile.totalViews >= 50
      },
      'first_rating': {
        id: 'first_rating',
        name: '⭐ Critique Avisé',
        description: 'Évaluer votre premier tutoriel',
        icon: '⭐',
        points: 15,
        condition: (profile) => profile.totalRatings >= 1
      },
      'rating_10': {
        id: 'rating_10',
        name: '📊 Expert en Évaluation',
        description: 'Évaluer 10 tutoriels',
        icon: '📊',
        points: 75,
        condition: (profile) => profile.totalRatings >= 10
      },
      'first_favorite': {
        id: 'first_favorite',
        name: '❤️ Amoureux du Savoir',
        description: 'Ajouter votre premier favori',
        icon: '❤️',
        points: 20,
        condition: (profile) => profile.totalFavorites >= 1
      },
      'favorite_10': {
        id: 'favorite_10',
        name: '💖 Collecteur de Perles',
        description: 'Ajouter 10 favoris',
        icon: '💖',
        points: 100,
        condition: (profile) => profile.totalFavorites >= 10
      },
      'streak_7': {
        id: 'streak_7',
        name: '🔥 Semaine Chargée',
        description: 'Maintenir une série de 7 jours',
        icon: '🔥',
        points: 150,
        condition: (profile) => profile.streak >= 7
      },
      'streak_30': {
        id: 'streak_30',
        name: '⚡ Mois de Feu',
        description: 'Maintenir une série de 30 jours',
        icon: '⚡',
        points: 500,
        condition: (profile) => profile.streak >= 30
      },
      'level_5': {
        id: 'level_5',
        name: '🎖️ Niveau 5',
        description: 'Atteindre le niveau 5',
        icon: '🎖️',
        points: 0,
        condition: (profile) => profile.level >= 5
      },
      'explorer': {
        id: 'explorer',
        name: '🗺️ Explorateur',
        description: 'Visiter toutes les catégories',
        icon: '🗺️',
        points: 200,
        condition: (profile) => profile.categoriesVisited >= 6
      }
    };
  }
  
  loadUserProfile() {
    try {
      const saved = localStorage.getItem('tutofacile_gamification');
      if (saved) {
        this.userProfile = { ...this.userProfile, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.debug('Could not load user profile');
    }
  }
  
  saveUserProfile() {
    localStorage.setItem('tutofacile_gamification', JSON.stringify(this.userProfile));
  }
  
  addPoints(points, reason = '') {
    this.userProfile.points += points;
    this.checkLevelUp();
    this.saveUserProfile();
    return points;
  }
  
  checkLevelUp() {
    const pointsPerLevel = 100;
    const newLevel = Math.floor(this.userProfile.points / pointsPerLevel) + 1;
    
    if (newLevel > this.userProfile.level) {
      const oldLevel = this.userProfile.level;
      this.userProfile.level = newLevel;
      
      if (notificationManager) {
        notificationManager.notify(
          `🎉 Niveau ${newLevel}!`,
          {
            body: `Vous avez atteint le niveau ${newLevel}! +${(newLevel - oldLevel) * 50} points bonus`,
            type: 'success',
            icon: '🆙'
          }
        );
      }
      
      this.addPoints((newLevel - oldLevel) * 50);
    }
  }
  
  recordAction(action, data = {}) {
    switch(action) {
      case 'tuto_view':
        this.userProfile.totalViews++;
        this.addPoints(5);
        this.updateStreak();
        break;
      case 'tuto_rating':
        this.userProfile.totalRatings++;
        this.addPoints(10);
        break;
      case 'favorite_add':
        this.userProfile.totalFavorites++;
        this.addPoints(5);
        break;
      case 'category_visit':
        if (!this.userProfile.categoriesVisited) {
          this.userProfile.categoriesVisited = 0;
        }
        if (!this.userProfile.visitedCategories) {
          this.userProfile.visitedCategories = [];
        }
        if (!this.userProfile.visitedCategories.includes(data.category)) {
          this.userProfile.visitedCategories.push(data.category);
          this.userProfile.categoriesVisited = this.userProfile.visitedCategories.length;
        }
        break;
    }
    
    this.checkAchievements();
    this.saveUserProfile();
  }
  
  updateStreak() {
    const lastVisit = this.userProfile.lastVisit;
    const today = new Date().setHours(0, 0, 0, 0);
    const lastDate = new Date(lastVisit).setHours(0, 0, 0, 0);
    const daysDiff = (today - lastDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff === 0) {
      // Same day, no change
    } else if (daysDiff === 1) {
      // Next day, increase streak
      this.userProfile.streak++;
      if (notificationManager) {
        notificationManager.notify(`🔥 Série: ${this.userProfile.streak} jours!`, {
          body: 'Continuez ainsi!',
          icon: '🔥'
        });
      }
    } else if (daysDiff > 1) {
      // Streak broken, reset
      this.userProfile.streak = 1;
    }
    
    this.userProfile.lastVisit = Date.now();
  }
  
  checkAchievements() {
    for (const [key, achievement] of Object.entries(this.achievements)) {
      if (!this.userProfile.unlockedAchievements.includes(key)) {
        if (achievement.condition(this.userProfile)) {
          this.unlockAchievement(key);
        }
      }
    }
  }
  
  unlockAchievement(achievementId) {
    if (!this.userProfile.unlockedAchievements.includes(achievementId)) {
      this.userProfile.unlockedAchievements.push(achievementId);
      
      const achievement = this.achievements[achievementId];
      if (achievement) {
        this.addPoints(achievement.points);
        
        if (notificationManager) {
          notificationManager.notify(
            `${achievement.icon} ${achievement.name}`,
            {
              body: achievement.description + ` +${achievement.points}pts`,
              type: 'success'
            }
          );
        }
      }
    }
  }
  
  getProfile() {
    return this.userProfile;
  }
  
  displayProfile() {
    const profile = this.userProfile;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const unlockedCount = profile.unlockedAchievements.length;
    const totalCount = Object.keys(this.achievements).length;
    const progressPercent = (unlockedCount / totalCount) * 100;
    
    modal.innerHTML = `
      <div class="modal" style="max-width: 800px;">
        <div class="modal-header">
          <h2>👤 Mon Profil</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-content">
          <div class="profile-header">
            <div class="level-badge">
              <span class="level-number">${profile.level}</span>
              <span class="level-label">Niveau</span>
            </div>
            <div class="profile-stats">
              <div class="stat">
                <strong>${profile.points}</strong> Points
              </div>
              <div class="stat">
                <strong>${profile.streak}</strong> 🔥 Série
              </div>
              <div class="stat">
                <strong>${profile.totalViews}</strong> Tutoriels Vus
              </div>
            </div>
          </div>
          
          <div style="margin: 20px 0;">
            <h3>📈 Progression Générale</h3>
            <div style="background: #f0f0f0; border-radius: 8px; height: 20px; overflow: hidden;">
              <div style="background: linear-gradient(to right, var(--primary), var(--accent)); 
                          width: ${progressPercent}%; height: 100%; transition: width 0.3s;">
              </div>
            </div>
            <p style="text-align: center; margin-top: 8px; color: #666;">
              ${unlockedCount}/${totalCount} Succès débloqués
            </p>
          </div>
          
          <h3>🏆 Vos Succès</h3>
          <div class="achievements-grid">
            ${Object.entries(this.achievements).map(([key, achievement]) => {
              const unlocked = profile.unlockedAchievements.includes(key);
              return `
                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                  <div class="achievement-icon">${achievement.icon}</div>
                  <div class="achievement-info">
                    <strong>${achievement.name}</strong>
                    <p>${achievement.description}</p>
                    <span class="achievement-points">+${achievement.points}pts</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .profile-header {
        display: flex;
        gap: 30px;
        margin-bottom: 30px;
        align-items: center;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        padding: 20px;
        border-radius: 8px;
        color: white;
      }
      
      .level-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        border: 3px solid white;
      }
      
      .level-number {
        font-size: 40px;
        font-weight: bold;
      }
      
      .level-label {
        font-size: 12px;
        opacity: 0.9;
      }
      
      .profile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      
      .stat {
        text-align: center;
      }
      
      .stat strong {
        display: block;
        font-size: 24px;
        margin-bottom: 5px;
      }
      
      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 12px;
        margin: 20px 0;
      }
      
      .achievement-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #ddd;
        opacity: 0.4;
        transition: all 0.2s;
      }
      
      .achievement-item.unlocked {
        opacity: 1;
        background: #f0f8f0;
        border-color: #4caf50;
      }
      
      .achievement-item.unlocked:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .achievement-icon {
        font-size: 32px;
        flex-shrink: 0;
      }
      
      .achievement-info {
        flex: 1;
      }
      
      .achievement-info strong {
        display: block;
        font-size: 13px;
        color: var(--primary);
      }
      
      .achievement-info p {
        margin: 4px 0;
        font-size: 12px;
        color: #666;
      }
      
      .achievement-points {
        display: inline-block;
        background: var(--primary);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize gamification
let gamificationEngine;
document.addEventListener('DOMContentLoaded', () => {
  gamificationEngine = new GamificationEngine();
  
  // Add profile button to header
  const header = document.querySelector('header');
  if (header) {
    const profileBtn = document.createElement('button');
    profileBtn.innerHTML = `👤 Niveau ${gamificationEngine.userProfile.level}`;
    profileBtn.className = 'btn-secondary';
    profileBtn.style.marginLeft = '10px';
    profileBtn.onclick = () => gamificationEngine.displayProfile();
    header.appendChild(profileBtn);
  }
});

// Record actions from other modules
window.recordGameAction = (action, data) => {
  if (gamificationEngine) {
    gamificationEngine.recordAction(action, data);
  }
};

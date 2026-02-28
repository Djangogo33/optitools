// ============ FEATURE FLAGS & CONFIGURATION ============
// Enable/disable modules, set options

window.TUTOFACILE_CONFIG = {
  // Feature Toggles
  features: {
    advancedSearch: true,
    analytics: true,
    recommendations: true,
    notifications: true,
    gamification: true,
    favorites: true,
    serviceWorker: true,
    performanceOptimization: true,
    offlineMode: true
  },
  
  // Analytics Configuration
  analytics: {
    enabled: true,
    trackPageViews: true,
    trackUserBehavior: true,
    trackPerformance: true,
    persistEvents: true,
    eventRetention: 100 // max events to keep
  },
  
  // Notification Configuration
  notifications: {
    enabled: true,
    requestPermission: true,
    browserNotifications: true,
    inAppNotifications: true,
    autoHide: true,
    autoHideDelay: 5000, // ms
    maxNotifications: 3,
    position: 'top-right' // top-left, top-right, bottom-left, bottom-right
  },
  
  // Search Configuration
  search: {
    enabled: true,
    minQueryLength: 2,
    debounceDelay: 300, // ms
    maxResults: 20,
    caseSensitive: false,
    highlightResults: true,
    advancedFiltersEnabled: true
  },
  
  // Recommendation Configuration
  recommendations: {
    enabled: true,
    defaultCount: 5,
    minHistoryForRecommendations: 1,
    algorithmVersion: 'v1', // v1, v2, etc
    diversityLevel: 0.5, // 0-1, how diverse recommendations should be
    updateFrequency: 'on-view', // on-view, periodic, on-demand
    showSimilarTutorials: true,
    similarTutorialsCount: 4
  },
  
  // Gamification Configuration
  gamification: {
    enabled: true,
    pointsPerView: 5,
    pointsPerRating: 10,
    pointsPerFavorite: 5,
    pointsPerLevel: 100,
    achievementsEnabled: true,
    streakTrackingEnabled: true,
    levelProgressionEnabled: true,
    notifyAchievements: true,
    notifyLevelUp: true,
    maxFavorites: 50
  },
  
  // Performance Configuration
  performance: {
    lazyLoadImages: true,
    lazyLoadThreshold: '50px',
    deferNonCriticalScripts: true,
    deferTimeout: 2000, // ms
    enableServiceWorker: true,
    enableOfflineMode: true,
    cacheStrategy: 'cache-first', // cache-first, network-first, stale-while-revalidate
    cacheName: 'v1-tutofacile-2026',
    cacheMaxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  
  // Data Persistence
  persistence: {
    useLocalStorage: true,
    useIndexedDB: false, // for larger datasets
    enableDataExport: true,
    enableDataImport: true,
    encryptSensitiveData: false,
    compressionEnabled: false
  },
  
  // API Configuration
  api: {
    baseUrl: window.location.origin,
    timeout: 5000, // ms
    retryAttempts: 3,
    retryDelay: 1000, // ms
    analyticsEndpoint: '/analytics/event',
    useBeacon: true
  },
  
  // Display Configuration
  display: {
    theme: 'light', // light, dark, auto
    language: 'fr', // fr, en, es, etc
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h', // 12h or 24h
    compactMode: false,
    animationsEnabled: true,
    reducedMotion: false
  },
  
  // Logging Configuration
  logging: {
    enabled: false, // set to true for debugging
    logToConsole: false,
    logToServer: false,
    logLevel: 'info' // debug, info, warn, error
  },
  
  // Feature Experiment Configuration
  experiments: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalyticsV2: false,
    enableRecommendationsV2: false
  }
};

// ============ CONFIGURATION METHODS ============

window.TUTOFACILE = {
  config: window.TUTOFACILE_CONFIG,
  
  /**
   * Enable/disable a feature
   * @param {string} featureName - Feature name
   * @param {boolean} enabled - Whether to enable
   */
  setFeature(featureName, enabled) {
    this.config.features[featureName] = enabled;
    console.log(`Feature '${featureName}' is now ${enabled ? 'enabled' : 'disabled'}`);
  },
  
  /**
   * Check if a feature is enabled
   * @param {string} featureName - Feature name
   * @returns {boolean}
   */
  isFeatureEnabled(featureName) {
    return this.config.features[featureName] === true;
  },
  
  /**
   * Get configuration value
   * @param {string} path - Dot notation path (e.g., 'analytics.enabled')
   * @returns {*}
   */
  getConfig(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  },
  
  /**
   * Set configuration value
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   */
  setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] || (obj[key] = {}), this.config);
    target[lastKey] = value;
  },
  
  /**
   * Reset all features to default
   */
  resetToDefaults() {
    this.config = JSON.parse(JSON.stringify(window.TUTOFACILE_CONFIG));
    console.log('Configuration reset to defaults');
  },
  
  /**
   * Export configuration
   */
  exportConfig() {
    return JSON.stringify(this.config, null, 2);
  },
  
  /**
   * Import configuration
   * @param {string} configJson - JSON string of configuration
   */
  importConfig(configJson) {
    try {
      this.config = JSON.parse(configJson);
      console.log('Configuration imported successfully');
      return true;
    } catch (e) {
      console.error('Failed to import configuration', e);
      return false;
    }
  },
  
  /**
   * Apply configuration to all modules
   */
  applyConfiguration() {
    // Apply to analytics
    if (window.analytics) {
      if (!this.isFeatureEnabled('analytics')) {
        console.log('Analytics disabled by configuration');
      }
    }
    
    // Apply to search
    if (window.searchEngine) {
      if (!this.isFeatureEnabled('advancedSearch')) {
        console.log('Advanced search disabled by configuration');
      }
    }
    
    // Apply to notifications
    if (window.notificationManager) {
      if (!this.isFeatureEnabled('notifications')) {
        console.log('Notifications disabled by configuration');
      }
    }
    
    // Apply to gamification
    if (window.gamificationEngine) {
      if (!this.isFeatureEnabled('gamification')) {
        console.log('Gamification disabled by configuration');
      }
    }
    
    console.log('Configuration applied to all modules');
  },
  
  /**
   * Show configuration dashboard
   */
  showConfigDashboard() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width: 900px;">
        <div class="modal-header">
          <h2>⚙️ Configuration TutoFacile</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-content" style="max-height: 600px; overflow-y: auto;">
          <h3>🎯 Fonctionnalités</h3>
          <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            ${Object.entries(this.config.features).map(([name, enabled]) => `
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="checkbox" ${enabled ? 'checked' : ''} 
                       onchange="TUTOFACILE.setFeature('${name}', this.checked)">
                <span>${name}</span>
              </label>
            `).join('')}
          </div>
          
          <h3>📊 Analytics</h3>
          <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            <label>
              <input type="checkbox" ${this.config.analytics.enabled ? 'checked' : ''}
                     onchange="TUTOFACILE.setConfig('analytics.enabled', this.checked)">
              Activer Analytics
            </label>
            <label>
              <input type="checkbox" ${this.config.analytics.trackPageViews ? 'checked' : ''}
                     onchange="TUTOFACILE.setConfig('analytics.trackPageViews', this.checked)">
              Tracker les pages vues
            </label>
          </div>
          
          <h3>🎮 Gamification</h3>
          <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            <label>
              <input type="checkbox" ${this.config.gamification.enabled ? 'checked' : ''}
                     onchange="TUTOFACILE.setConfig('gamification.enabled', this.checked)">
              Activer Gamification
            </label>
            <label>
              Points par tutoriel:
              <input type="number" value="${this.config.gamification.pointsPerView}"
                     onchange="TUTOFACILE.setConfig('gamification.pointsPerView', parseInt(this.value))">
            </label>
          </div>
          
          <h3>🔧 Actions</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="btn-primary" onclick="
              const config = TUTOFACILE.exportConfig();
              const blob = new Blob([config], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'tutofacile-config.json';
              a.click();
            ">📥 Exporter Config</button>
            <button class="btn-secondary" onclick="TUTOFACILE.resetToDefaults(); location.reload();">
              🔄 Réinitialiser
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
};

// Make configuration globally accessible
document.addEventListener('DOMContentLoaded', () => {
  // Add configuration button to footer or admin panel
  console.log('✅ Configuration system loaded');
  console.log('Access via: TUTOFACILE.config');
  console.log('Commands: setFeature(), isFeatureEnabled(), getConfig(), setConfig()');
});

// Log current configuration
console.log('🔧 TutoFacile Configuration loaded');
console.log('Use TUTOFACILE.showConfigDashboard() to open config panel');

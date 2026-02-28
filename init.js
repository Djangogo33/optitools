// ============ TUTOFACILE MAIN INITIALIZATION ============
// Master initialization script that loads all modules

(function() {
  'use strict';
  
  // Configuration
  const MODULES = [
    { name: 'config-system', required: true, type: 'core' },
    { name: 'advanced-search', required: false, type: 'feature' },
    { name: 'analytics-engine', required: false, type: 'feature' },
    { name: 'recommendation-engine', required: false, type: 'feature' },
    { name: 'notification-manager', required: false, type: 'feature' },
    { name: 'gamification-engine', required: false, type: 'feature' }
  ];
  
  const MODULE_TIMEOUT = 5000; // 5 seconds per module
  let loadedModules = {};
  let failedModules = [];
  
  /**
   * Log message with module context
   */
  function log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const color = {
      info: '#0066cc',
      success: '#00aa00',
      warning: '#ff9900',
      error: '#cc0000'
    }[level] || '#000000';
    
    console.log(
      `%c[TutoFacile ${timestamp}] ${message}`,
      `color: ${color}; font-weight: bold;`
    );
  }
  
  /**
   * Load a module script dynamically
   */
  function loadModule(moduleName, required = false) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (loadedModules[moduleName]) {
        resolve(moduleName);
        return;
      }
      
      // Check if should skip
      const featureName = moduleName.replace('-', '_');
      if (TUTOFACILE && TUTOFACILE.config) {
        const featureKey = Object.keys(TUTOFACILE.config.features).find(f => 
          f.replace(/_/g, '-') === moduleName
        );
        if (featureKey && !TUTOFACILE.config.features[featureKey]) {
          log(`⏭️  ${moduleName} skipped (disabled in config)`, 'info');
          resolve(moduleName);
          return;
        }
      }
      
      const script = document.createElement('script');
      script.src = `${moduleName}.js`;
      script.defer = true;
      script.type = 'text/javascript';
      
      const timeout = setTimeout(() => {
        reject(new Error(`Module ${moduleName} load timeout (${MODULE_TIMEOUT}ms)`));
      }, MODULE_TIMEOUT);
      
      script.onload = () => {
        clearTimeout(timeout);
        loadedModules[moduleName] = true;
        log(`✅ ${moduleName} loaded`, 'success');
        resolve(moduleName);
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        const message = `Failed to load ${moduleName}`;
        if (required) {
          log(`❌ ${message} (REQUIRED)`, 'error');
          reject(new Error(message));
        } else {
          log(`⚠️  ${message} (optional)`, 'warning');
          failedModules.push(moduleName);
          resolve(moduleName);
        }
      };
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * Load all modules sequentially
   */
  async function loadAllModules() {
    log('🚀 Initializing TutoFacile...', 'info');
    
    const requiredModules = MODULES.filter(m => m.required);
    const optionalModules = MODULES.filter(m => !m.required);
    
    // Load required modules first
    for (const module of requiredModules) {
      try {
        await loadModule(module.name, true);
      } catch (error) {
        log(`❌ Failed to load required module: ${error.message}`, 'error');
        return false;
      }
    }
    
    // Load optional modules in parallel
    const optionalPromises = optionalModules.map(m => 
      loadModule(m.name, false).catch(() => {})
    );
    
    try {
      await Promise.all(optionalPromises);
    } catch (error) {
      log(`⚠️  Some optional modules failed to load`, 'warning');
    }
    
    return true;
  }
  
  /**
   * Initialize all loaded modules
   */
  function initializeModules() {
    log('🔧 Initializing modules...', 'info');
    
    const initializers = {
      'advanced-search': () => {
        if (window.searchEngine && window.searchEngine.init) {
          window.searchEngine.init();
        }
      },
      'analytics-engine': () => {
        if (window.analytics && window.analytics.init) {
          window.analytics.init();
        }
      },
      'recommendation-engine': () => {
        if (window.recommendationEngine && window.recommendationEngine.init) {
          window.recommendationEngine.init();
        }
      },
      'notification-manager': () => {
        if (window.notificationManager && window.notificationManager.init) {
          window.notificationManager.init();
        }
      },
      'gamification-engine': () => {
        if (window.gamificationEngine && window.gamificationEngine.init) {
          window.gamificationEngine.init();
        }
      }
    };
    
    Object.entries(initializers).forEach(([name, initializer]) => {
      if (loadedModules[name]) {
        try {
          initializer();
          log(`✅ ${name} initialized`, 'success');
        } catch (error) {
          log(`❌ Failed to initialize ${name}: ${error.message}`, 'error');
        }
      }
    });
  }
  
  /**
   * Setup event recording hooks
   */
  function setupEventHooks() {
    // Hook for tuto view
    window.recordTutoView = function(tutoId, title) {
      if (window.analytics) analytics.trackTutoView(tutoId, title);
      if (window.gamificationEngine) recordGameAction('tuto_view', {});
      if (window.recommendationEngine) recommendationEngine.trackView(tutoId);
    };
    
    // Hook for rating
    window.recordTutoRating = function(tutoId, rating) {
      if (window.analytics) analytics.trackTutoRating(tutoId, rating);
      if (window.gamificationEngine) recordGameAction('tuto_rating', {});
      if (window.recommendationEngine) recommendationEngine.trackRating(tutoId, rating);
    };
    
    // Hook for favorite
    window.recordFavorite = function(tutoId, action) {
      if (window.analytics) analytics.trackFavorite(tutoId, action);
      if (action === 'add') {
        if (window.gamificationEngine) recordGameAction('favorite_add', {});
      }
    };
    
    // Hook for search
    window.recordSearch = function(query, resultsCount) {
      if (window.analytics) analytics.trackSearch(query, resultsCount);
    };
    
    // Hook for category visit
    window.recordCategoryVisit = function(category) {
      if (window.gamificationEngine) recordGameAction('category_visit', { category });
    };
  }
  
  /**
   * Display startup summary
   */
  function displaySummary() {
    const total = MODULES.length;
    const loaded = Object.keys(loadedModules).length;
    const failed = failedModules.length;
    
    log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'info');
    log(`📊 Initialization Summary:`, 'info');
    log(`   ✅ Loaded: ${loaded}/${total}`, 'success');
    if (failed > 0) {
      log(`   ⚠️  Failed: ${failed}`, 'warning');
      failedModules.forEach(m => log(`      - ${m}`, 'warning'));
    }
    log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`, 'info');
  }
  
  /**
   * Main initialization entry point
   */
  async function initialize() {
    try {
      // Load all modules
      const success = await loadAllModules();
      
      if (!success) {
        log('❌ Initialization failed due to required module errors', 'error');
        return;
      }
      
      // Wait for DOM to be ready
      if (document.readyState !== 'loading') {
        initializeModules();
        setupEventHooks();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          initializeModules();
          setupEventHooks();
        });
      }
      
      displaySummary();
      log('✨ TutoFacile ready!', 'success');
      
    } catch (error) {
      log(`❌ Unexpected error during initialization: ${error.message}`, 'error');
    }
  }
  
  // Start initialization when document is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Export initialization API
  window.TutoFacileInit = {
    initialize,
    loadModule,
    loadedModules: () => loadedModules,
    failedModules: () => failedModules,
    getStatus: () => ({
      total: MODULES.length,
      loaded: Object.keys(loadedModules).length,
      failed: failedModules.length,
      loadedModules,
      failedModules
    })
  };
  
})();

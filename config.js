// ============================================================
// TUTOFACILE - Configuration Globale
// ============================================================

const CONFIG = {
  // Informations Générales
  APP_NAME: 'TutoFacile',
  VERSION: '2.0',
  AUTHOR: 'Marie & Paul',
  
  // Couleurs
  COLORS: {
    primary: '#0069f6',
    primary_light: '#e8f0ff',
    accent: '#00c4a7',
    accent_light: '#e8f8f5',
    text: '#1a1a1a',
    text_light: '#666',
    background: '#ffffff',
    background_light: '#f5f7fa',
    border: '#e0e0e0',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444'
  },
  
  // Authentification
  AUTH: {
    // Admin credentials
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD_HASH: 'paul1810', // À remplacer par hash
    
    // Où les données sont stockées
    STORAGE_KEYS: {
      users: 'tutofacile_users',
      current_user: 'tutofacile_current_user',
      admin_user: 'tutofacile_admin_user',
      dark_mode: 'tutofacile_dark_mode',
      language: 'siteLang',
      user_tutorials: 'tutofacile_user_{username}',
      contributions: 'tutofacile_contributions',
      custom_tutorials: 'customTutos',
      mods: 'tutofacile_mods'
    },
    
    // Hashing
    HASH_ALGORITHM: 'simpleHash',
    SALT: 'tutofacile_salt_' // + username
  },
  
  // Categories
  CATEGORIES: [
    { name: 'Bricolage', icon: '🔨', color: '#0069f6' },
    { name: 'Cuisine', icon: '👨‍🍳', color: '#22c55e' },
    { name: 'Code', icon: '💻', color: '#0069f6' },
    { name: 'Jardinage', icon: '🌱', color: '#22c55e' }
  ],
  
  // Difficultés
  DIFFICULTIES: [
    { name: 'Facile', emoji: '⭐' },
    { name: 'Moyen', emoji: '⭐⭐' },
    { name: 'Difficile', emoji: '⭐⭐⭐' }
  ],
  
  // Données
  DATA: {
    TUTORIELS_FILE: 'data.json',
    TOTAL_TUTORIELS: 15,
    CATEGORIES_COUNT: 4,
    
    // Tutoriels Example Structure
    TUTO_TEMPLATE: {
      id: 0,
      titre: '',
      description: '',
      url: '',
      categorie: '',
      difficulty: '',
      time: 0,
      image: ''
    }
  },
  
  // UI
  UI: {
    PAGES_PER_LOAD: 12,
    FILTER_TYPES: ['all', 'Facile', 'Moyen', 'Difficile'],
    DARK_MODE_CLASS: 'dark-mode'
  },
  
  // URLs
  URLS: {
    home: '/',
    login: '/login.html',
    register: '/register.html',
    dashboard: '/my-dashboard.html',
    admin: '/admin.html',
    contribute: '/contribute.html',
    category: '/category.html',
    privacy: '/privacy.html',
    legal: '/legal.html',
    terms: '/terms.html'
  },
  
  // Validations
  VALIDATION: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 6,
    PASSWORD_MAX: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  // Messages
  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Connexion réussie!',
      REGISTER: 'Inscription réussie!',
      CREATE: 'Tutoriel créé avec succès!',
      UPDATE: 'Tutoriel mis à jour!'
    },
    ERROR: {
      LOGIN: 'Identifiants invalides',
      REGISTER: 'Erreur lors de l\'inscription',
      USER_EXISTS: 'Cet utilisateur existe déjà',
      WEAK_PASSWORD: 'Le mot de passe doit faire au moins 6 caractères',
      INVALID_EMAIL: 'Email invalide'
    }
  }
};

// ============================================================
// Fonctions Globales
// ============================================================

/**
 * Récupère une couleur par nom
 * @param {string} colorName - Le nom de la couleur
 * @returns {string} Code couleur hex
 */
function getColor(colorName) {
  return CONFIG.COLORS[colorName] || '#000000';
}

/**
 * Récupère une clé de stockage
 * @param {string} key - Nom de la clé
 * @returns {string} Clé de stockage
 */
function getStorageKey(key) {
  return CONFIG.AUTH.STORAGE_KEYS[key] || key;
}

/**
 * Log en production-safe
 */
function safeLog(message, data = null) {
  if(typeof console !== 'undefined') {
    console.log(`[${CONFIG.APP_NAME}] ${message}`, data);
  }
}

// Export pour modules
if(typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

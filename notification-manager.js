// ============ PUSH NOTIFICATIONS & ALERTS SYSTEM ============
// Browser notifications, alerts, system messages

class NotificationManager {
  constructor() {
    this.queue = [];
    this.maxNotifications = 3;
    this.init();
  }
  
  init() {
    this.requestPermission();
    this.setupUI();
  }
  
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (e) {
        console.debug('Notification permission request failed');
        return false;
      }
    }
    return Notification.permission === 'granted';
  }
  
  notify(title, options = {}) {
    const notification = {
      title,
      options: {
        icon: options.icon || '📚',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'tutofacile-notification',
        requireInteraction: false,
        ...options
      },
      id: Date.now()
    };
    
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, notification.options);
      } catch (e) {
        console.debug('Could not show notification');
      }
    }
    
    // Show in-app notification
    this.showInAppNotification(notification);
  }
  
  showInAppNotification(notification) {
    const container = document.getElementById('notification-container') || this.createContainer();
    
    const element = document.createElement('div');
    element.className = 'notification notification-' + (notification.options.type || 'info');
    element.id = 'notif-' + notification.id;
    element.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${notification.options.icon}</span>
        <div class="notification-text">
          <strong>${notification.title}</strong>
          ${notification.options.body ? `<p>${notification.options.body}</p>` : ''}
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="notification-progress"></div>
    `;
    
    container.appendChild(element);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      element.classList.add('notification-exit');
      setTimeout(() => element.remove(), 300);
    }, 5000);
  }
  
  createContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
  }
  
  setupUI() {
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin-bottom: 10px;
        overflow: hidden;
        animation: slideIn 0.3s ease;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .notification-exit {
        animation: slideOut 0.3s ease;
      }
      
      @keyframes slideOut {
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      .notification-content {
        display: flex;
        gap: 12px;
        padding: 12px 15px;
        align-items: flex-start;
      }
      
      .notification-icon {
        font-size: 20px;
        flex-shrink: 0;
      }
      
      .notification-text {
        flex: 1;
      }
      
      .notification-text strong {
        display: block;
        color: #333;
        margin-bottom: 4px;
      }
      
      .notification-text p {
        margin: 0;
        font-size: 13px;
        color: #666;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        flex-shrink: 0;
      }
      
      .notification-close:hover {
        color: #333;
      }
      
      .notification-progress {
        height: 2px;
        background: linear-gradient(to right, var(--primary), var(--accent));
        animation: progress 5s linear forwards;
      }
      
      @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
      }
      
      .notification-success {
        border-left: 4px solid #4caf50;
      }
      
      .notification-error {
        border-left: 4px solid #f44336;
      }
      
      .notification-warning {
        border-left: 4px solid #ff9800;
      }
      
      .notification-info {
        border-left: 4px solid var(--primary);
      }
      
      @media (max-width: 600px) {
        #notification-container {
          max-width: 90%;
          left: 5%;
          right: 5%;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  success(title, body) {
    this.notify(title, {
      body,
      type: 'success',
      icon: '✅'
    });
  }
  
  error(title, body) {
    this.notify(title, {
      body,
      type: 'error',
      icon: '❌'
    });
  }
  
  warning(title, body) {
    this.notify(title, {
      body,
      type: 'warning',
      icon: '⚠️'
    });
  }
  
  info(title, body) {
    this.notify(title, {
      body,
      type: 'info',
      icon: 'ℹ️'
    });
  }
  
  // Scheduled notifications
  scheduleNotification(title, delay, options = {}) {
    setTimeout(() => {
      this.notify(title, options);
    }, delay);
  }
  
  // Tutorial update notifications
  notifyNewTutorial(tuto) {
    this.notify(`📚 Nouveau tutoriel: ${tuto.titre}`, {
      body: `${tuto.categorie} • ${tuto.difficulty} • ${tuto.time}min`,
      icon: '🆕',
      type: 'info'
    });
  }
  
  // Achievement notifications
  notifyAchievement(achievement, description) {
    this.notify(`🏆 Succès débloqué: ${achievement}`, {
      body: description,
      icon: '🎉',
      type: 'success'
    });
  }
  
  // Rating reminders
  notifyRatingReminder(tutoTitle) {
    this.notify(`⭐ Évaluer "${tutoTitle}"?`, {
      body: 'Partagez votre expérience avec la communauté',
      icon: '⭐',
      type: 'info'
    });
  }
  
  // Session alerts
  notifySessionStart() {
    this.info('👋 Bienvenue!', 'Continuez vos apprentissages');
  }
  
  notifySessionEnd() {
    this.info('👋 À bientôt!', 'Vos progrès ont été enregistrés');
  }
  
  // Streak notifications
  notifyStreak(days) {
    if (days % 5 === 0) {
      this.notifyAchievement(`${days} jours de suite!`, 
        `Excellent! Vous apprenez régulièrement.`);
    }
  }
}

// Initialize notification manager
let notificationManager;
document.addEventListener('DOMContentLoaded', () => {
  notificationManager = new NotificationManager();
  
  // Show welcome message
  notificationManager.notifySessionStart();
});

// Global notification helper
window.showNotification = (type, title, body) => {
  if (notificationManager) {
    notificationManager[type](title, body);
  }
};

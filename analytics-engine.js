// ============ USER ANALYTICS & ENGAGEMENT TRACKING ============
// Track views, ratings, time spent, popular content

class AnalyticsEngine {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
    this.startTime = Date.now();
    this.init();
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  init() {
    this.setupEventTracking();
    this.trackPageView();
    this.setupPerformanceTracking();
    this.setupSessionStorage();
  }
  
  trackPageView() {
    this.trackEvent('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }
  
  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      data: {
        ...data,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent.substring(0, 100),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      }
    };
    
    this.events.push(event);
    
    // Persist event
    this.persistEvent(event);
    
    // Send to server if available (fallback to localStorage)
    this.sendEvent(event);
  }
  
  trackTutoView(tutoId, title) {
    this.trackEvent('tuto_view', {
      tutoId: tutoId,
      title: title
    });
  }
  
  trackTutoRating(tutoId, rating) {
    this.trackEvent('tuto_rating', {
      tutoId: tutoId,
      rating: rating,
      timestamp: new Date().toISOString()
    });
  }
  
  trackFavorite(tutoId, action) {
    this.trackEvent('favorite_action', {
      tutoId: tutoId,
      action: action // 'add' or 'remove'
    });
  }
  
  trackSearch(query, resultsCount) {
    this.trackEvent('search', {
      query: query,
      resultsCount: resultsCount
    });
  }
  
  setupEventTracking() {
    // Track outbound links
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.href) {
        const url = e.target.href;
        if (!url.includes(window.location.hostname)) {
          this.trackEvent('outbound_link', { url: url });
        }
      }
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        if (maxScroll % 25 === 0) {
          this.trackEvent('scroll_depth', { percentage: maxScroll });
        }
      }
    });
    
    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.trackEvent('form_submit', {
        formId: form.id,
        formName: form.name,
        fieldsCount: form.elements.length
      });
    });
    
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('session_end', {
          duration: Date.now() - this.startTime
        });
      } else {
        this.trackEvent('session_resume', {});
      }
    });
    
    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('page_leave', {
        timeOnPage: Date.now() - this.startTime
      });
    });
  }
  
  setupPerformanceTracking() {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      // LCP
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.trackEvent('web_vital_lcp', {
              value: Math.round(lastEntry.renderTime || lastEntry.loadTime)
            });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.debug('LCP tracking not available');
        }
      }
    }
    
    // Track page load time
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      this.trackEvent('page_load_metrics', {
        pageLoadTime,
        connectTime,
        renderTime
      });
    });
  }
  
  setupSessionStorage() {
    // Store analytics data in localStorage
    const storageKey = 'tutofacile_analytics_' + this.sessionId;
    setInterval(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          events: this.events,
          duration: Date.now() - this.startTime,
          sessionId: this.sessionId
        }));
      } catch (e) {
        console.debug('LocalStorage quota exceeded');
      }
    }, 10000); // Save every 10 seconds
  }
  
  persistEvent(event) {
    try {
      const key = 'tutofacile_event_' + event.timestamp;
      const existingEvents = JSON.parse(localStorage.getItem('tutofacile_events') || '[]');
      existingEvents.push(event);
      
      // Keep only last 100 events
      if (existingEvents.length > 100) {
        existingEvents.shift();
      }
      
      localStorage.setItem('tutofacile_events', JSON.stringify(existingEvents));
    } catch (e) {
      console.debug('Could not persist event');
    }
  }
  
  sendEvent(event) {
    // Try to send to analytics server
    if (navigator.sendBeacon) {
      try {
        navigator.sendBeacon('/analytics/event', JSON.stringify(event));
      } catch (e) {
        console.debug('Analytics server not available');
      }
    }
  }
  
  getDashboard() {
    const tutoViews = this.events
      .filter(e => e.name === 'tuto_view')
      .reduce((acc, e) => {
        acc[e.data.tutoId] = (acc[e.data.tutoId] || 0) + 1;
        return acc;
      }, {});
    
    const ratings = this.events
      .filter(e => e.name === 'tuto_rating')
      .map(e => ({
        tutoId: e.data.tutoId,
        rating: e.data.rating,
        timestamp: e.timestamp
      }));
    
    const searches = this.events
      .filter(e => e.name === 'search')
      .map(e => ({
        query: e.data.query,
        resultsCount: e.data.resultsCount
      }));
    
    const favorites = this.events
      .filter(e => e.name === 'favorite_action')
      .length;
    
    return {
      sessionDuration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      tutoViews,
      topTutos: Object.entries(tutoViews)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      averageRating: ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        : 0,
      totalSearches: searches.length,
      topSearches: searches
        .reduce((acc, s) => {
          acc[s.query] = (acc[s.query] || 0) + 1;
          return acc;
        }, {}),
      favoritesCount: favorites,
      scrollDepth: Math.max(...this.events
        .filter(e => e.name === 'scroll_depth')
        .map(e => e.data.percentage)
        || [0])
    };
  }
  
  showDashboard() {
    const dashboard = this.getDashboard();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width: 800px;">
        <div class="modal-header">
          <h2>📊 Votre Tableau de Bord</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div>
        <div class="modal-content">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div class="stat-card">
              <h3>⏱️ Durée Session</h3>
              <p>${Math.round(dashboard.sessionDuration / 1000)}s</p>
            </div>
            <div class="stat-card">
              <h3>📺 Tutos Vus</h3>
              <p>${Object.keys(dashboard.tutoViews).length}</p>
            </div>
            <div class="stat-card">
              <h3>⭐ Note Moyenne</h3>
              <p>${dashboard.averageRating}/5</p>
            </div>
            <div class="stat-card">
              <h3>❤️ Favoris</h3>
              <p>${dashboard.favoritesCount}</p>
            </div>
            <div class="stat-card">
              <h3>🔍 Recherches</h3>
              <p>${dashboard.totalSearches}</p>
            </div>
            <div class="stat-card">
              <h3>📜 Scroll Profondeur</h3>
              <p>${Math.round(dashboard.scrollDepth)}%</p>
            </div>
          </div>
          
          ${dashboard.topTutos.length > 0 ? `
            <h3>🏆 Tutos les Plus Vus</h3>
            <ol>
              ${dashboard.topTutos.map(([id, count]) => `<li>Tuto #${id}: ${count} vues</li>`).join('')}
            </ol>
          ` : ''}
          
          <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">Fermer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const style = document.createElement('style');
    style.textContent = `
      .stat-card {
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
      }
      
      .stat-card h3 {
        margin: 0 0 10px 0;
        font-size: 14px;
        opacity: 0.9;
      }
      
      .stat-card p {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize analytics
let analytics;
document.addEventListener('DOMContentLoaded', () => {
  analytics = new AnalyticsEngine();
  
  // Add dashboard button to header
  const header = document.querySelector('header');
  if (header) {
    const dashBtn = document.createElement('button');
    dashBtn.innerHTML = '📊 Dashboard';
    dashBtn.className = 'btn-secondary';
    dashBtn.style.marginLeft = '10px';
    dashBtn.onclick = () => analytics.showDashboard();
    header.appendChild(dashBtn);
  }
});

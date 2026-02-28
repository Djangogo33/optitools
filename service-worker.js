// ============ SERVICE WORKER - OFFLINE & CACHE STRATEGY ============
// Cache-first strategy for static assets, Network-first for API calls

const CACHE_VERSION = 'v1-tutofacile-2026';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/pages-styles.css',
  '/legal.css',
  '/performance-critical.css',
  '/script.js',
  '/performance-optimization.js',
  '/legal-cookie-banner.js',
  '/favicon.svg',
  '/data.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Network-first for API calls
  if (url.pathname.includes('/api/') || url.pathname.includes('.json')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return caches.match(request);
          }
          
          const cache = caches.open(DYNAMIC_CACHE);
          cache.then(c => c.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
  // Cache-first for static assets
  else if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request).then(res => {
          if (res.ok) {
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, res.clone()));
          }
          return res;
        }))
        .catch(() => {
          if (request.destination === 'image') {
            return caches.match('/img-placeholder.svg');
          }
          return new Response('Offline', { status: 503 });
        })
    );
  }
  // Network-first for HTML
  else if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request) || caches.match('/index.html'))
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comments' || event.tag === 'sync-ratings') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('offline-actions', 'readonly');
    const store = tx.objectStore('offline-actions');
    const actions = await store.getAll();
    
    for (const action of actions) {
      try {
        await fetch(action.url, {
          method: action.method,
          body: JSON.stringify(action.data)
        });
        
        // Delete after successful sync
        const deleteTx = db.transaction('offline-actions', 'readwrite');
        deleteTx.objectStore('offline-actions').delete(action.id);
      } catch (e) {
        console.error('Sync failed:', e);
      }
    }
  } catch (e) {
    console.error('Sync error:', e);
  }
}

async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TutoFacileDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-actions')) {
        db.createObjectStore('offline-actions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: data.customData || {}
  };
  
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

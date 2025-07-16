const CACHE_NAME = 'auray-petition-v1.0.0'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icons/manifest-icon-192.maskable.png',
  '/icons/icons/manifest-icon-512.maskable.png'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installation en cours...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Cache ouvert')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Assets mis en cache')
        return self.skipWaiting()
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('⚡ Service Worker: Activation en cours...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Suppression ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('✅ Service Worker: Nettoyage terminé')
      return self.clients.claim()
    })
  )
})

// Stratégie de cache: Network First pour les API, Cache First pour les assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Bypass pour les URLs Google Cloud Storage - laisser le navigateur gérer directement
  if (url.hostname === 'storage.googleapis.com') {
    // Ne pas intercepter ces requêtes
    return;
  }

  // Bypass pour reCAPTCHA - CRITIQUE pour éviter les erreurs CSP
  if (url.hostname === 'recaptcha.net' || url.hostname === 'www.recaptcha.net' || 
      url.hostname === 'www.google.com' || url.hostname === 'www.gstatic.com') {
    // Ne pas intercepter les requêtes reCAPTCHA - laisser le navigateur gérer
    return;
  }

  // API Routes: Network First (données en temps réel)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone pour mettre en cache si succès
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback sur le cache en cas d'échec réseau
          return caches.match(request)
        })
    )
    return
  }

  // Assets statiques: Cache First
  if (STATIC_ASSETS.includes(url.pathname) || 
      url.pathname.startsWith('/icons/') ||
      url.pathname.startsWith('/_next/static/')) {
    
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
        })
    )
    return
  }

  // Autres requêtes: Network First avec fallback
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Gestion des notifications push (pour futurs updates)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle mise à jour de la pétition Auray',
    icon: '/icons/icons/manifest-icon-192.maskable.png',
    badge: '/icons/icons/manifest-icon-72.maskable.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir la pétition',
        icon: '/icons/shortcut-sign.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/close.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Pétition Auray', options)
  )
})

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification cliquée:', event.action)
  
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

console.log('🎯 Service Worker Auray Pétition: Prêt à révolutionner la démocratie !')

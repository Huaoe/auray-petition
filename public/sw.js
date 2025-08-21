// Auto-generated Service Worker - DO NOT EDIT MANUALLY
// Generated at: 2025-08-21T15:45:30.781Z
const APP_VERSION = "1.0.0";
const BUILD_TIMESTAMP = 1755791130781;
const CACHE_NAME = `auray-petition-v${APP_VERSION}-${BUILD_TIMESTAMP}`;

// Cache strategies
const CACHE_STRATEGIES = {
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  NETWORK_ONLY: 'network-only'
};

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icons/manifest-icon-192.maskable.png",
  "/icons/icons/manifest-icon-512.maskable.png",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  console.log("🚀 Service Worker: Installation en cours...", CACHE_NAME);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Service Worker: Cache ouvert");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("✅ Service Worker: Assets mis en cache");
        // Force immediate activation
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("❌ Service Worker: Erreur installation:", error);
      })
  );
});

// Activation du Service Worker
self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker: Activation en cours...", CACHE_NAME);

  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️ Service Worker: Suppression ancien cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
    .then(() => {
      console.log("✅ Service Worker: Activation terminée");
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: APP_VERSION,
            timestamp: BUILD_TIMESTAMP
          });
        });
      });
    })
    .catch((error) => {
      console.error("❌ Service Worker: Erreur activation:", error);
    })
  );
});

// Enhanced fetch handler with better caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Bypass pour les URLs externes critiques
  const externalBypassHosts = [
    "storage.googleapis.com",
    "images.unsplash.com",
    "recaptcha.net",
    "www.recaptcha.net",
    "www.google.com",
    "www.gstatic.com"
  ];

  if (externalBypassHosts.includes(url.hostname)) {
    return;
  }

  // API Routes: Network Only avec timeout
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request, { 
        timeout: 10000 // 10 second timeout
      }).catch((error) => {
        console.error("❌ API fetch failed:", url.pathname, error);
        return new Response(
          JSON.stringify({ error: "Network error", offline: true }), 
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // Next.js static assets: Cache First
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Static assets: Cache First
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // HTML pages: Network First with cache fallback
  if (
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname === "/" ||
    !url.pathname.includes(".")
  ) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Default: Network First
  event.respondWith(networkFirstStrategy(request));
});

// Cache First Strategy
const cacheFirstStrategy = async (request) => {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("❌ Cache First failed:", request.url, error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response("Offline", { status: 503 });
  }
};

// Network First Strategy
const networkFirstStrategy = async (request) => {
  try {
    const networkResponse = await fetch(request, { timeout: 5000 });
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("🔄 Network failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response("Offline", { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: APP_VERSION,
      timestamp: BUILD_TIMESTAMP,
      cacheName: CACHE_NAME
    });
  }
});

// Gestion des notifications push
self.addEventListener("push", (event) => {
  const options = {
    body: event.data
      ? event.data.text()
      : "Nouvelle mise à jour de la pétition Auray",
    icon: "/icons/icons/manifest-icon-192.maskable.png",
    badge: "/icons/icons/manifest-icon-192.maskable.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "explore",
        title: "Voir la pétition",
        icon: "/icons/icons/manifest-icon-192.maskable.png",
      },
      {
        action: "close",
        title: "Fermer",
        icon: "/icons/icons/manifest-icon-192.maskable.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Pétition Auray", options)
  );
});

// Gestion des clics sur notifications
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification cliquée:", event.action);

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

console.log(
  `🎯 Service Worker Auray Pétition v${APP_VERSION}: Prêt à révolutionner la démocratie !`
);

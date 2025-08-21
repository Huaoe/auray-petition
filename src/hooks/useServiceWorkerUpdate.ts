'use client';

import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerInfo {
  version: string;
  timestamp: number;
  cacheName: string;
}

interface UseServiceWorkerUpdateReturn {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  updateApp: () => void;
  skipWaiting: () => void;
  currentVersion: ServiceWorkerInfo | null;
  newVersion: ServiceWorkerInfo | null;
}

export const useServiceWorkerUpdate = (): UseServiceWorkerUpdateReturn => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<ServiceWorkerInfo | null>(null);
  const [newVersion, setNewVersion] = useState<ServiceWorkerInfo | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Get current service worker version
  const getCurrentVersion = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration?.active) return null;

      return new Promise<ServiceWorkerInfo | null>((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };

        registration.active.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );

        // Timeout after 2 seconds
        setTimeout(() => resolve(null), 2000);
      });
    } catch (error) {
      console.error('Error getting current version:', error);
      return null;
    }
  }, []);

  // Force update the app
  const updateApp = useCallback(() => {
    if (!registration) return;

    setIsUpdating(true);
    
    // Clear all caches first
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      // Reload the page to get fresh content
      window.location.reload();
    }).catch((error) => {
      console.error('Error clearing caches:', error);
      window.location.reload();
    });
  }, [registration]);

  // Skip waiting and activate new service worker
  const skipWaiting = useCallback(() => {
    if (!registration?.waiting) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [registration]);

  // Handle service worker messages
  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'SW_UPDATED') {
      setNewVersion({
        version: event.data.version,
        timestamp: event.data.timestamp,
        cacheName: `auray-petition-v${event.data.version}-${event.data.timestamp}`
      });
      setIsUpdateAvailable(true);
    }
  }, []);

  // Register service worker and set up listeners
  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);

        // Get current version
        const version = await getCurrentVersion();
        setCurrentVersion(version);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              setIsUpdateAvailable(true);
            }
          });
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

        // Check for updates every 30 seconds
        const updateInterval = setInterval(() => {
          reg.update();
        }, 30000);

        return () => {
          clearInterval(updateInterval);
          navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        };
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [getCurrentVersion, handleServiceWorkerMessage]);

  // Listen for service worker controller changes
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleControllerChange = () => {
      // Service worker has been updated and is now controlling the page
      setIsUpdating(false);
      setIsUpdateAvailable(false);
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  return {
    isUpdateAvailable,
    isUpdating,
    updateApp,
    skipWaiting,
    currentVersion,
    newVersion
  };
};
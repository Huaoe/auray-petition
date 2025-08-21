'use client';

export interface CacheInfo {
  name: string;
  size: number;
  keys: string[];
}

export interface CacheStats {
  totalCaches: number;
  totalSize: number;
  caches: CacheInfo[];
}

/**
 * Get information about all caches
 */
export const getCacheStats = async (): Promise<CacheStats> => {
  if (!('caches' in window)) {
    return { totalCaches: 0, totalSize: 0, caches: [] };
  }

  try {
    const cacheNames = await caches.keys();
    const cacheInfoPromises = cacheNames.map(async (name): Promise<CacheInfo> => {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      
      // Estimate cache size (rough calculation)
      let size = 0;
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          size += blob.size;
        }
      }

      return {
        name,
        size,
        keys: keys.map(req => req.url)
      };
    });

    const cacheInfos = await Promise.all(cacheInfoPromises);
    const totalSize = cacheInfos.reduce((sum, cache) => sum + cache.size, 0);

    return {
      totalCaches: cacheNames.length,
      totalSize,
      caches: cacheInfos
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalCaches: 0, totalSize: 0, caches: [] };
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = async (): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    const deletePromises = cacheNames.map(name => caches.delete(name));
    await Promise.all(deletePromises);
    
    console.log('✅ All caches cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
    return false;
  }
};

/**
 * Clear old caches (keep only the current one)
 */
export const clearOldCaches = async (currentCacheName: string): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => name !== currentCacheName);
    
    if (oldCaches.length === 0) {
      console.log('✅ No old caches to clear');
      return true;
    }

    const deletePromises = oldCaches.map(name => {
      console.log('🗑️ Clearing old cache:', name);
      return caches.delete(name);
    });
    
    await Promise.all(deletePromises);
    console.log(`✅ Cleared ${oldCaches.length} old caches`);
    return true;
  } catch (error) {
    console.error('❌ Error clearing old caches:', error);
    return false;
  }
};

/**
 * Check if a specific cache exists
 */
export const cacheExists = async (cacheName: string): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    return cacheNames.includes(cacheName);
  } catch (error) {
    console.error('Error checking cache existence:', error);
    return false;
  }
};

/**
 * Force refresh a specific URL in cache
 */
export const refreshCachedUrl = async (url: string, cacheName?: string): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    // If no cache name provided, try to find it in any cache
    if (!cacheName) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const response = await cache.match(url);
        if (response) {
          cacheName = name;
          break;
        }
      }
    }

    if (!cacheName) {
      console.log('URL not found in any cache:', url);
      return false;
    }

    const cache = await caches.open(cacheName);
    
    // Delete old cached version
    await cache.delete(url);
    
    // Fetch fresh version
    const freshResponse = await fetch(url);
    if (freshResponse.ok) {
      await cache.put(url, freshResponse);
      console.log('✅ Refreshed cached URL:', url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error refreshing cached URL:', error);
    return false;
  }
};

/**
 * Format bytes to human readable format
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if browser supports service workers and caching
 */
export const isCacheSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'caches' in window;
};

/**
 * Get current service worker state
 */
export const getServiceWorkerState = (): string => {
  if (!('serviceWorker' in navigator)) {
    return 'not-supported';
  }

  if (!navigator.serviceWorker.controller) {
    return 'not-registered';
  }

  return navigator.serviceWorker.controller.state || 'unknown';
};
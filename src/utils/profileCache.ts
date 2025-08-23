interface CachedProfile {
  data: any;
  timestamp: number;
  expiresAt: number;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds (reduced for faster updates)
const profileCache = new Map<string, CachedProfile>();

export const getCachedProfile = (key: string): any | null => {
  const cached = profileCache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expiresAt) {
    profileCache.delete(key);
    return null;
  }
  
  return cached.data;
};

export const setCachedProfile = (key: string, data: any): void => {
  const now = Date.now();
  profileCache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION
  });
  
  // Also cache in localStorage for persistence across sessions
  try {
    localStorage.setItem(`profile_cache_${key}`, JSON.stringify({
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    }));
  } catch (error) {
    console.warn('Failed to cache profile in localStorage:', error);
  }
};

export const getCachedProfileFromStorage = (key: string): any | null => {
  try {
    const cached = localStorage.getItem(`profile_cache_${key}`);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(`profile_cache_${key}`);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.warn('Failed to load cached profile from localStorage:', error);
    return null;
  }
};

export const clearProfileCache = (key?: string): void => {
  if (key) {
    profileCache.delete(key);
    localStorage.removeItem(`profile_cache_${key}`);
  } else {
    profileCache.clear();
    // Clear all profile cache items from localStorage
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('profile_cache_')) {
        localStorage.removeItem(k);
      }
    });
  }
};

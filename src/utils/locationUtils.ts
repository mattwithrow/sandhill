export interface LocationData {
  location: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  state?: string;
  city?: string;
}

// Common timezone mappings for popular locations
const TIMEZONE_MAPPINGS: Record<string, string> = {
  // US Cities
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'houston': 'America/Chicago',
  'phoenix': 'America/Phoenix',
  'philadelphia': 'America/New_York',
  'san antonio': 'America/Chicago',
  'san diego': 'America/Los_Angeles',
  'dallas': 'America/Chicago',
  'san jose': 'America/Los_Angeles',
  'austin': 'America/Chicago',
  'jacksonville': 'America/New_York',
  'fort worth': 'America/Chicago',
  'columbus': 'America/New_York',
  'charlotte': 'America/New_York',
  'san francisco': 'America/Los_Angeles',
  'indianapolis': 'America/New_York',
  'seattle': 'America/Los_Angeles',
  'denver': 'America/Denver',
  'washington': 'America/New_York',
  'boston': 'America/New_York',
  'nashville': 'America/Chicago',
  'baltimore': 'America/New_York',
  'portland': 'America/Los_Angeles',
  'las vegas': 'America/Los_Angeles',
  'milwaukee': 'America/Chicago',
  'albuquerque': 'America/Denver',
  'tucson': 'America/Phoenix',
  'fresno': 'America/Los_Angeles',
  'sacramento': 'America/Los_Angeles',
  'atlanta': 'America/New_York',
  'kansas city': 'America/Chicago',
  'long beach': 'America/Los_Angeles',
  'colorado springs': 'America/Denver',
  'miami': 'America/New_York',
  'raleigh': 'America/New_York',
  'omaha': 'America/Chicago',
  'minneapolis': 'America/Chicago',
  'cleveland': 'America/New_York',
  'tulsa': 'America/Chicago',
  'arlington': 'America/Chicago',
  'wichita': 'America/Chicago',
  'new orleans': 'America/Chicago',
  'bakersfield': 'America/Los_Angeles',
  'tampa': 'America/New_York',
  'honolulu': 'Pacific/Honolulu',
  'anaheim': 'America/Los_Angeles',
  'aurora': 'America/Denver',
  'santa ana': 'America/Los_Angeles',
  'corpus christi': 'America/Chicago',
  'riverside': 'America/Los_Angeles',
  'lexington': 'America/New_York',
  'stockton': 'America/Los_Angeles',
  'henderson': 'America/Los_Angeles',
  'saint paul': 'America/Chicago',
  'st. louis': 'America/Chicago',
  'cincinnati': 'America/New_York',
  'pittsburgh': 'America/New_York',
  'anchorage': 'America/Anchorage',
  
  // Canadian Cities
  'toronto': 'America/Toronto',
  'montreal': 'America/Montreal',
  'vancouver': 'America/Vancouver',
  'calgary': 'America/Edmonton',
  'edmonton': 'America/Edmonton',
  'ottawa': 'America/Toronto',
  'winnipeg': 'America/Winnipeg',
  'quebec': 'America/Montreal',
  'hamilton': 'America/Toronto',
  'kitchener': 'America/Toronto',
  'london ontario': 'America/Toronto',
  'victoria': 'America/Vancouver',
  'halifax': 'America/Halifax',
  'st. johns': 'America/St_Johns',
  
  // UK Cities
  'london': 'Europe/London',
  'manchester': 'Europe/London',
  'birmingham': 'Europe/London',
  'leeds': 'Europe/London',
  'liverpool': 'Europe/London',
  'sheffield': 'Europe/London',
  'edinburgh': 'Europe/London',
  'bristol': 'Europe/London',
  'glasgow': 'Europe/London',
  'cardiff': 'Europe/London',
  'belfast': 'Europe/London',
  
  // European Cities
  'paris': 'Europe/Paris',
  'berlin': 'Europe/Berlin',
  'madrid': 'Europe/Madrid',
  'rome': 'Europe/Rome',
  'amsterdam': 'Europe/Amsterdam',
  'brussels': 'Europe/Brussels',
  'vienna': 'Europe/Vienna',
  'zurich': 'Europe/Zurich',
  'stockholm': 'Europe/Stockholm',
  'oslo': 'Europe/Oslo',
  'copenhagen': 'Europe/Copenhagen',
  'helsinki': 'Europe/Helsinki',
  'warsaw': 'Europe/Warsaw',
  'prague': 'Europe/Prague',
  'budapest': 'Europe/Budapest',
  'athens': 'Europe/Athens',
  'lisbon': 'Europe/Lisbon',
  'dublin': 'Europe/Dublin',
  'moscow': 'Europe/Moscow',
  'istanbul': 'Europe/Istanbul',
  
  // Asian Cities
  'tokyo': 'Asia/Tokyo',
  'seoul': 'Asia/Seoul',
  'beijing': 'Asia/Shanghai',
  'shanghai': 'Asia/Shanghai',
  'hong kong': 'Asia/Hong_Kong',
  'singapore': 'Asia/Singapore',
  'bangkok': 'Asia/Bangkok',
  'jakarta': 'Asia/Jakarta',
  'manila': 'Asia/Manila',
  'kuala lumpur': 'Asia/Kuala_Lumpur',
  'ho chi minh city': 'Asia/Ho_Chi_Minh',
  'hanoi': 'Asia/Ho_Chi_Minh',
  'delhi': 'Asia/Kolkata',
  'mumbai': 'Asia/Kolkata',
  'bangalore': 'Asia/Kolkata',
  'chennai': 'Asia/Kolkata',
  'kolkata': 'Asia/Kolkata',
  'hyderabad': 'Asia/Kolkata',
  'pune': 'Asia/Kolkata',
  'ahmedabad': 'Asia/Kolkata',
  'surat': 'Asia/Kolkata',
  'jaipur': 'Asia/Kolkata',
  'lucknow': 'Asia/Kolkata',
  'kanpur': 'Asia/Kolkata',
  'nagpur': 'Asia/Kolkata',
  'indore': 'Asia/Kolkata',
  'thane': 'Asia/Kolkata',
  'bhopal': 'Asia/Kolkata',
  'visakhapatnam': 'Asia/Kolkata',
  'patna': 'Asia/Kolkata',
  'vadodara': 'Asia/Kolkata',
  'ghaziabad': 'Asia/Kolkata',
  'ludhiana': 'Asia/Kolkata',
  'agra': 'Asia/Kolkata',
  'nashik': 'Asia/Kolkata',
  'ranchi': 'Asia/Kolkata',
  'faridabad': 'Asia/Kolkata',
  'meerut': 'Asia/Kolkata',
  'rajkot': 'Asia/Kolkata',
  'kalyan': 'Asia/Kolkata',
  'vasai': 'Asia/Kolkata',
  'sterling': 'Asia/Kolkata',
  'andhra pradesh': 'Asia/Kolkata',
  'arunachal pradesh': 'Asia/Kolkata',
  'assam': 'Asia/Kolkata',
  'bihar': 'Asia/Kolkata',
  'chhattisgarh': 'Asia/Kolkata',
  'goa': 'Asia/Kolkata',
  'gujarat': 'Asia/Kolkata',
  'haryana': 'Asia/Kolkata',
  'himachal pradesh': 'Asia/Kolkata',
  'jharkhand': 'Asia/Kolkata',
  'karnataka': 'Asia/Kolkata',
  'kerala': 'Asia/Kolkata',
  'madhya pradesh': 'Asia/Kolkata',
  'maharashtra': 'Asia/Kolkata',
  'manipur': 'Asia/Kolkata',
  'meghalaya': 'Asia/Kolkata',
  'mizoram': 'Asia/Kolkata',
  'nagaland': 'Asia/Kolkata',
  'odisha': 'Asia/Kolkata',
  'punjab': 'Asia/Kolkata',
  'rajasthan': 'Asia/Kolkata',
  'sikkim': 'Asia/Kolkata',
  'tamil nadu': 'Asia/Kolkata',
  'telangana': 'Asia/Kolkata',
  'tripura': 'Asia/Kolkata',
  'uttar pradesh': 'Asia/Kolkata',
  'uttarakhand': 'Asia/Kolkata',
  'west bengal': 'Asia/Kolkata',
  
  // Australian Cities
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'brisbane': 'Australia/Brisbane',
  'perth': 'Australia/Perth',
  'adelaide': 'Australia/Adelaide',
  'canberra': 'Australia/Sydney',
  'darwin': 'Australia/Darwin',
  'hobart': 'Australia/Hobart',
  
  // Common terms
  'remote': 'UTC',
  'anywhere': 'UTC',
  'worldwide': 'UTC',
  'global': 'UTC',
  'online': 'UTC',
  'virtual': 'UTC',
};

// Get user's current timezone
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    return 'UTC';
  }
};

// Detect timezone from location string
export const detectTimezoneFromLocation = (location: string): string => {
  if (!location) return getUserTimezone();
  
  const locationLower = location.toLowerCase().trim();
  
  // Check for remote/global terms first
  if (locationLower.includes('remote') || 
      locationLower.includes('anywhere') || 
      locationLower.includes('worldwide') || 
      locationLower.includes('global') ||
      locationLower.includes('online') ||
      locationLower.includes('virtual')) {
    return 'UTC';
  }
  
  // Check exact matches
  if (TIMEZONE_MAPPINGS[locationLower]) {
    return TIMEZONE_MAPPINGS[locationLower];
  }
  
  // Check partial matches
  for (const [key, timezone] of Object.entries(TIMEZONE_MAPPINGS)) {
    if (locationLower.includes(key) || key.includes(locationLower)) {
      return timezone;
    }
  }
  
  // Default to user's timezone if no match found
  return getUserTimezone();
};

// Geocode location using browser's geolocation API
export const geocodeLocation = async (location: string): Promise<{ latitude?: number; longitude?: number }> => {
  // For now, return undefined - in a real implementation, you'd use a geocoding service
  // like Google Maps API, OpenStreetMap, or similar
  return { latitude: undefined, longitude: undefined };
};

// Process location input and return structured data
export const processLocationInput = async (locationInput: string): Promise<LocationData> => {
  const timezone = detectTimezoneFromLocation(locationInput);
  const coords = await geocodeLocation(locationInput);
  
  return {
    location: locationInput,
    timezone,
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
};

// Format timezone for display
export const formatTimezone = (timezone: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    return formatter.formatToParts(now).find(part => part.type === 'timeZoneName')?.value || timezone;
  } catch (error) {
    return timezone;
  }
};

// Get current time in a specific timezone
export const getTimeInTimezone = (timezone: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return formatter.format(now);
  } catch (error) {
    return 'Unknown';
  }
};

// Check if location is remote
export const isRemoteLocation = (location: string): boolean => {
  if (!location) return false;
  const locationLower = location.toLowerCase();
  return locationLower.includes('remote') || 
         locationLower.includes('anywhere') || 
         locationLower.includes('worldwide') || 
         locationLower.includes('global') ||
         locationLower.includes('online') ||
         locationLower.includes('virtual');
};

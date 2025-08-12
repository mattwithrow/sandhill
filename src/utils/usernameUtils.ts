// Username validation and sanitization utilities

export interface UsernameValidation {
  isValid: boolean;
  message: string;
}

export const validateUsername = (username: string): UsernameValidation => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 30) {
    return { isValid: false, message: 'Username must be 30 characters or less' };
  }
  
  // Only allow alphanumeric characters, hyphens, and underscores
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validUsernameRegex.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, hyphens (-), and underscores (_)' };
  }
  
  // Cannot start or end with hyphen or underscore
  if (username.startsWith('-') || username.startsWith('_') || username.endsWith('-') || username.endsWith('_')) {
    return { isValid: false, message: 'Username cannot start or end with hyphens or underscores' };
  }
  
  // Cannot have consecutive hyphens or underscores
  if (username.includes('--') || username.includes('__') || username.includes('-_') || username.includes('_-')) {
    return { isValid: false, message: 'Username cannot have consecutive hyphens or underscores' };
  }
  
  return { isValid: true, message: 'Username is valid' };
};

export const sanitizeUsername = (username: string): string => {
  if (!username) return '';
  
  // Remove all invalid characters
  let sanitized = username.replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Remove leading/trailing hyphens and underscores
  sanitized = sanitized.replace(/^[-_]+|[-_]+$/g, '');
  
  // Replace consecutive hyphens/underscores with single ones
  sanitized = sanitized.replace(/[-_]{2,}/g, (match) => match[0]);
  
  // Limit length
  if (sanitized.length > 30) {
    sanitized = sanitized.substring(0, 30);
  }
  
  // Ensure minimum length
  if (sanitized.length < 3) {
    sanitized = sanitized.padEnd(3, '0');
  }
  
  return sanitized;
};

export const generateUsernameSuggestion = (name: string): string => {
  if (!name) return '';
  
  // Convert to lowercase and remove special characters
  let suggestion = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Add random numbers if too short
  if (suggestion.length < 3) {
    suggestion += Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }
  
  // Limit length
  if (suggestion.length > 30) {
    suggestion = suggestion.substring(0, 30);
  }
  
  return suggestion;
};

// Common username patterns to avoid
export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'support', 'help', 'info',
  'mail', 'email', 'webmaster', 'noreply', 'no-reply', 'test', 'demo',
  'sandhill', 'sandhill-admin', 'sandhill-support'
];

export const isReservedUsername = (username: string): boolean => {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
};

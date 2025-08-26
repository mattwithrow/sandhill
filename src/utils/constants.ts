// Application constants
export const APP_NAME = 'Sandhill';
export const APP_DESCRIPTION = 'Connect with the right people to build what matters.';

// API constants
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 3;

// Form validation constants
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const BIO_MAX_LENGTH = 1000;
export const EXPERIENCE_MAX_LENGTH = 1000;

// Pagination constants
export const DEFAULT_ITEMS_PER_PAGE = 12;
export const MAX_ITEMS_PER_PAGE = 50;

// Time constants
export const DEBOUNCE_DELAY = 500; // milliseconds
export const WELCOME_MODAL_DELAY = 2000; // milliseconds

// Local storage keys
export const STORAGE_KEYS = {
  USER_EMAIL: 'userEmail',
  PROFILE_PREFIX: 'profile_email_',
  TIME_COMMITMENT_PREFIX: 'timeCommitment_',
  WELCOME_MODAL_PREFIX: 'welcomeModalSeen_',
  PROFILE_CACHE_PREFIX: 'public_'
} as const;

// Account status options
export const ACCOUNT_STATUS_OPTIONS = {
  ACTIVE: 'active',
  BUSY: 'busy',
  INACTIVE: 'inactive'
} as const;

// Time commitment options
export const TIME_COMMITMENT_OPTIONS = [
  '1-5 hours per week',
  '5-10 hours per week',
  '10-20 hours per week',
  '20+ hours per week',
  'Flexible'
] as const;

// Social media platforms
export const SOCIAL_PLATFORMS = {
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  WEBSITE: 'website'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTHENTICATION_ERROR: 'Authentication error. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  PROFILE_NOT_FOUND: 'Profile not found.',
  USERNAME_TAKEN: 'Username is already taken. Please choose a different one.',
  INVALID_USERNAME: 'Username must be 3-30 characters and contain only letters, numbers, hyphens, and underscores.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_SAVED: 'Profile saved successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ACCOUNT_DELETED: 'Account marked as deleted successfully.'
} as const;

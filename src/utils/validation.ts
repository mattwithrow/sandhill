import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, BIO_MAX_LENGTH, EXPERIENCE_MAX_LENGTH } from './constants';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface UsernameValidationResult extends ValidationResult {
  isUnique?: boolean;
}

// Username validation
export const validateUsername = (username: string): UsernameValidationResult => {
  if (!username) {
    return {
      isValid: false,
      message: 'Username is required'
    };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      isValid: false,
      message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`
    };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      message: `Username must be no more than ${USERNAME_MAX_LENGTH} characters`
    };
  }

  // Check for valid characters (letters, numbers, hyphens, underscores)
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validUsernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, hyphens (-), and underscores (_)'
    };
  }

  // Check for reserved words
  const reservedWords = ['admin', 'root', 'system', 'sandhill', 'api', 'www', 'mail', 'ftp'];
  if (reservedWords.includes(username.toLowerCase())) {
    return {
      isValid: false,
      message: 'This username is reserved and cannot be used'
    };
  }

  return {
    isValid: true,
    message: 'Username is valid'
  };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      message: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }

  return {
    isValid: true,
    message: 'Email is valid'
  };
};

// URL validation
export const validateUrl = (url: string, allowEmpty: boolean = true): ValidationResult => {
  if (!url) {
    if (allowEmpty) {
      return {
        isValid: true,
        message: 'URL is optional'
      };
    }
    return {
      isValid: false,
      message: 'URL is required'
    };
  }

  try {
    // Add protocol if missing
    let urlToValidate = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToValidate = `https://${url}`;
    }
    
    new URL(urlToValidate);
    return {
      isValid: true,
      message: 'URL is valid'
    };
  } catch {
    return {
      isValid: false,
      message: 'Please enter a valid URL'
    };
  }
};

// Text length validation
export const validateTextLength = (
  text: string, 
  maxLength: number, 
  fieldName: string = 'Text'
): ValidationResult => {
  if (!text) {
    return {
      isValid: true,
      message: `${fieldName} is optional`
    };
  }

  if (text.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${maxLength} characters`
    };
  }

  return {
    isValid: true,
    message: `${fieldName} is valid`
  };
};

// Bio validation
export const validateBio = (bio: string): ValidationResult => {
  return validateTextLength(bio, BIO_MAX_LENGTH, 'Bio');
};

// Experience validation
export const validateExperience = (experience: string): ValidationResult => {
  return validateTextLength(experience, EXPERIENCE_MAX_LENGTH, 'Experience');
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }

  return {
    isValid: true,
    message: `${fieldName} is valid`
  };
};

// Form validation helper
export const validateForm = (formData: Record<string, unknown>, validationRules: Record<string, (value: unknown) => ValidationResult>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [field, validator] of Object.entries(validationRules)) {
    results[field] = validator(formData[field]);
  }

  return results;
};

// Check if form is valid
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Profile utilities for handling data validation and migration

export interface CompleteUserProfile {
  id: string;
  userId: string;
  username: string;
  userType: 'expert' | 'ventures' | 'both';
  bio: string;
  experience: string;
  passions: string;
  values: string;
  contributionGoals: string;
  skills: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  projectDetails: string;
  messagingEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Default profile structure
export const getDefaultProfile = (): CompleteUserProfile => ({
  id: '',
  userId: '',
  username: '',
  userType: 'expert',
  bio: '',
  experience: '',
  passions: '',
  values: '',
  contributionGoals: '',
  skills: '',
  location: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  websiteUrl: '',
  projectDetails: '',
  messagingEnabled: true,
});

// Validate and migrate profile data
export const validateAndMigrateProfile = (profile: any): CompleteUserProfile => {
  const defaultProfile = getDefaultProfile();

  if (!profile) {
    console.warn('No profile data provided, using defaults');
    return defaultProfile;
  }

  // Merge existing profile with defaults to ensure all fields exist
  const migratedProfile = {
    ...defaultProfile,
    ...profile,
    // Ensure required fields have proper defaults
    id: profile.id || '',
    userId: profile.userId || '',
    username: profile.username || '',
    userType: profile.userType || 'expert',
    bio: profile.bio || '',
    experience: profile.experience || '',
    passions: profile.passions || '',
    values: profile.values || '',
    contributionGoals: profile.contributionGoals || '',
    skills: profile.skills || '',
    location: profile.location || '',
    linkedinUrl: profile.linkedinUrl || '',
    githubUrl: profile.githubUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    twitterUrl: profile.twitterUrl || '',
    instagramUrl: profile.instagramUrl || '',
    websiteUrl: profile.websiteUrl || '',
    projectDetails: profile.projectDetails || '',
    messagingEnabled: profile.messagingEnabled !== undefined ? profile.messagingEnabled : true,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };

  console.log('Profile migrated successfully:', migratedProfile);
  return migratedProfile;
};

// Create a complete profile for a new user
export const createCompleteProfile = (userId: string): CompleteUserProfile => {
  return {
    ...getDefaultProfile(),
    userId: userId,
  };
};

// Check if a profile needs migration (has missing fields)
export const needsMigration = (profile: any): boolean => {
  const defaultProfile = getDefaultProfile();
  return Object.keys(defaultProfile).some(key => 
    key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && 
    profile[key] === undefined
  );
};

// Safe profile field access with fallbacks
export const getProfileField = (profile: CompleteUserProfile | null, field: keyof CompleteUserProfile, fallback: string = ''): string => {
  if (!profile) return fallback;
  return profile[field] || fallback;
};

// Validate profile data before saving
export const validateProfileData = (data: Partial<CompleteUserProfile>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.username && data.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (data.userType && !['expert', 'ventures', 'both'].includes(data.userType)) {
    errors.push('Invalid user type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

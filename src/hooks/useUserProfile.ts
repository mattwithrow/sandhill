import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

// Simplified profile type for localStorage
interface SimpleUserProfile {
  username: string;
  userType: 'expert' | 'ventures' | 'both';
  bio: string;
  experience: string;
  skills: string;
  location: string;
}

export const useUserProfile = () => {
  const { user, authStatus } = useAuthenticator();
  const [profile, setProfile] = useState<SimpleUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useUserProfile - Auth status:', authStatus);
    console.log('useUserProfile - User:', user);
    console.log('useUserProfile - User ID:', user?.userId);
    
    if (authStatus === 'authenticated' && user?.userId) {
      console.log('useUserProfile - Loading profile from localStorage...');
      loadProfile();
    } else if (authStatus === 'unauthenticated') {
      console.log('useUserProfile - User unauthenticated, clearing profile');
      setProfile(null);
      setIsLoading(false);
    } else {
      console.log('useUserProfile - Other auth status, setting loading to false');
      setIsLoading(false);
    }
  }, [authStatus, user?.userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading profile for user:', user?.userId);

      // Load from localStorage with multiple fallback strategies
      let profileData = null;
      
      // Try loading by current user ID first
      const savedProfile = localStorage.getItem(`profile_${user?.userId}`);
      if (savedProfile) {
        try {
          profileData = JSON.parse(savedProfile);
          console.log('Found profile in localStorage by user ID:', profileData);
        } catch (error) {
          console.error('Error parsing profile by user ID:', error);
        }
      }
      
      // If not found by user ID, try loading by email (more stable)
      if (!profileData && user?.signInDetails?.loginId) {
        const emailProfile = localStorage.getItem(`profile_email_${user.signInDetails.loginId}`);
        if (emailProfile) {
          try {
            profileData = JSON.parse(emailProfile);
            console.log('Found profile in localStorage by email:', profileData);
            // Save it with the current user ID for future use
            localStorage.setItem(`profile_${user.userId}`, emailProfile);
          } catch (error) {
            console.error('Error parsing profile by email:', error);
          }
        }
      }
      
      // If still not found, try loading the most recent profile
      if (!profileData) {
        const allKeys = Object.keys(localStorage);
        const profileKeys = allKeys.filter(key => key.startsWith('profile_') && !key.includes('email_') && !key.includes('timestamp_'));
        if (profileKeys.length > 0) {
          // Get the most recent profile
          const mostRecentKey = profileKeys[profileKeys.length - 1];
          const mostRecentProfile = localStorage.getItem(mostRecentKey);
          if (mostRecentProfile) {
            try {
              profileData = JSON.parse(mostRecentProfile);
              console.log('Found profile in localStorage by fallback:', profileData);
              // Save it with the current user ID for future use
              localStorage.setItem(`profile_${user.userId}`, mostRecentProfile);
            } catch (error) {
              console.error('Error parsing fallback profile:', error);
            }
          }
        }
      }
      
      if (profileData) {
        setProfile(profileData);
      } else {
        console.log('No profile found in localStorage');
        setProfile(null);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(`Error loading profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<SimpleUserProfile>) => {
    try {
      console.log('Updating profile with:', updates);
      
      if (!profile) {
        throw new Error('No profile to update');
      }
      
      const updatedProfile = { ...profile, ...updates } as SimpleUserProfile;
      
      // Save to localStorage with multiple keys for better persistence
      if (user?.userId) {
        const profileJson = JSON.stringify(updatedProfile);
        
        // Save with user ID
        localStorage.setItem(`profile_${user.userId}`, profileJson);
        
        // Also save with email for better persistence across sessions
        if (user.signInDetails?.loginId) {
          localStorage.setItem(`profile_email_${user.signInDetails.loginId}`, profileJson);
        }
        
        // Save timestamp for tracking
        localStorage.setItem(`profile_timestamp_${user.userId}`, Date.now().toString());
      }
      
      setProfile(updatedProfile);
      console.log('Profile updated successfully');
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw new Error(`Error updating profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const createProfile = async (profileData: SimpleUserProfile) => {
    try {
      console.log('Creating profile:', profileData);
      
      // Save to localStorage with multiple keys for better persistence
      if (user?.userId) {
        const profileJson = JSON.stringify(profileData);
        
        // Save with user ID
        localStorage.setItem(`profile_${user.userId}`, profileJson);
        
        // Also save with email for better persistence across sessions
        if (user.signInDetails?.loginId) {
          localStorage.setItem(`profile_email_${user.signInDetails.loginId}`, profileJson);
        }
        
        // Save timestamp for tracking
        localStorage.setItem(`profile_timestamp_${user.userId}`, Date.now().toString());
      }
      
      setProfile(profileData);
      console.log('Profile created successfully');
      return profileData;
    } catch (err) {
      console.error('Error creating profile:', err);
      throw new Error(`Error creating profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    createProfile,
    loadProfile
  };
}; 
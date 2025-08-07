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

      // Load from localStorage
      const savedProfile = localStorage.getItem(`profile_${user?.userId}`);
      
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          console.log('Found profile in localStorage:', profileData);
          setProfile(profileData);
        } catch (error) {
          console.error('Error parsing localStorage profile:', error);
          setError('Error loading profile data');
        }
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
      
      // Save to localStorage
      if (user?.userId) {
        localStorage.setItem(`profile_${user.userId}`, JSON.stringify(updatedProfile));
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
      
      // Save to localStorage
      if (user?.userId) {
        localStorage.setItem(`profile_${user.userId}`, JSON.stringify(profileData));
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
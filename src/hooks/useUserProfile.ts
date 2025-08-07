import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

type UserProfile = Schema["UserProfile"]["type"];

export const useUserProfile = () => {
  const { user, authStatus } = useAuthenticator();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useUserProfile - Auth status:', authStatus);
    console.log('useUserProfile - User:', user);
    console.log('useUserProfile - User ID:', user?.userId);
    
    if (authStatus === 'authenticated' && user?.userId) {
      console.log('useUserProfile - Loading profile...');
      loadOrCreateProfile();
    } else if (authStatus === 'unauthenticated') {
      console.log('useUserProfile - User unauthenticated, clearing profile');
      setProfile(null);
      setIsLoading(false);
    } else if (authStatus === 'authenticated' && !user?.userId) {
      console.log('useUserProfile - Authenticated but no user ID, waiting...');
      // Keep loading state true while waiting for user ID
    } else {
      console.log('useUserProfile - Other auth status, setting loading to false');
      setIsLoading(false);
    }
  }, [authStatus, user?.userId]);

  const loadOrCreateProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading profile for user:', user?.userId);

      // Generate client fresh for each request
      const client = generateClient<Schema>();
      console.log('Client generated successfully');

      // Try to find existing profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: {
          userId: { eq: user?.userId }
        }
      });

      console.log('Found profiles:', profiles.length);

      if (profiles.length > 0) {
        console.log('Using existing profile:', profiles[0]);
        setProfile(profiles[0]);
      } else {
        console.log('Creating new profile for user:', user?.userId);
        
        // Create new profile if none exists
        const result = await client.models.UserProfile.create({
          userId: user?.userId || '',
          username: '',
          userType: 'both',
          bio: '',
          experience: '',
          passions: '',
          values: '',
          contributionGoals: '',
          skills: '',
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          websiteUrl: '',
          projectDetails: ''
        });
        
        console.log('Created new profile:', result.data);
        setProfile(result.data);
      }
    } catch (err) {
      console.error('Error loading/creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile?.id) {
      throw new Error('No profile to update');
    }

    console.log('Updating profile with data:', updates);

    try {
      console.log('Updating existing profile with ID:', profile.id);
      
      // Generate client fresh for each request
      const client = generateClient<Schema>();
      
      const result = await client.models.UserProfile.update({
        id: profile.id,
        ...updates
      });
      
      console.log('Successfully updated profile:', result.data);
      setProfile(result.data);
      return result.data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: loadOrCreateProfile
  };
}; 
import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

type UserProfile = Schema["UserProfile"]["type"];

export const useUserProfile = () => {
  const { user, authStatus } = useAuthenticator();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'authenticated' && user?.userId) {
      loadOrCreateProfile();
    } else if (authStatus === 'unauthenticated') {
      setProfile(null);
      setIsLoading(false);
    }
  }, [authStatus, user?.userId]);

  const loadOrCreateProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load existing profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: {
          userId: { eq: user?.userId }
        }
      });

      if (profiles.length > 0) {
        setProfile(profiles[0]);
      } else {
        // Get username from user attributes
        const username = user?.signInDetails?.loginId || '';
        
        // Create new profile if none exists
        const result = await client.models.UserProfile.create({
          userId: user?.userId || '',
          username: username,
          userType: 'both',
          bio: '',
          experience: '',
          passions: '',
          values: '',
          contributionGoals: '',
          skills: [],
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          websiteUrl: '',
          projectDetails: ''
        });
        setProfile(result.data);
      }
    } catch (err) {
      console.error('Error loading/creating profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile?.id) {
      throw new Error('No profile to update');
    }

    try {
      const result = await client.models.UserProfile.update({
        id: profile.id,
        ...updates
      });
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
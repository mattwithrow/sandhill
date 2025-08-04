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

      console.log('Loading profile for user:', user?.userId);

      // Try to load existing profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: {
          userId: { eq: user?.userId }
        }
      });

      console.log('Found profiles:', profiles.length);

      if (profiles.length > 0) {
        console.log('Using existing profile:', profiles[0]);
        // Ensure the profile has all required fields
        const existingProfile = profiles[0];
        const updatedProfile = {
          ...existingProfile,
          bio: existingProfile.bio || '',
          experience: existingProfile.experience || '',
          passions: existingProfile.passions || '',
          values: existingProfile.values || '',
          contributionGoals: existingProfile.contributionGoals || '',
          skills: existingProfile.skills || '',
          linkedinUrl: existingProfile.linkedinUrl || '',
          githubUrl: existingProfile.githubUrl || '',
          portfolioUrl: existingProfile.portfolioUrl || '',
          twitterUrl: existingProfile.twitterUrl || '',
          instagramUrl: existingProfile.instagramUrl || '',
          websiteUrl: existingProfile.websiteUrl || '',
          projectDetails: existingProfile.projectDetails || ''
        };
        setProfile(updatedProfile);
      } else {
        console.log('Creating new profile for user:', user?.userId);
        // Get username from user attributes
        const username = user?.signInDetails?.loginId || user?.username || '';
        
        // Create new profile if none exists
        try {
          const result = await client.models.UserProfile.create({
            userId: user?.userId || '',
            username: username,
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
        } catch (createError) {
          console.error('Error creating profile with all fields:', createError);
          
          // Try creating a minimal profile as fallback
          try {
            console.log('Attempting to create minimal profile...');
            const minimalResult = await client.models.UserProfile.create({
              userId: user?.userId || '',
              username: username,
              userType: 'both',
              linkedinUrl: '',
              githubUrl: '',
              portfolioUrl: '',
              projectDetails: ''
            });
            console.log('Created minimal profile:', minimalResult.data);
            
                         // Add the new fields as empty strings
             const fullProfile: UserProfile = {
               ...minimalResult.data,
               bio: '',
               experience: '',
               passions: '',
               values: '',
               contributionGoals: '',
               skills: '',
               twitterUrl: '',
               instagramUrl: '',
               websiteUrl: ''
             } as UserProfile;
             setProfile(fullProfile);
          } catch (minimalError) {
            console.error('Error creating minimal profile:', minimalError);
            throw createError; // Throw the original error
          }
        }
      }
    } catch (err) {
      console.error('Error loading/creating profile:', err);
      setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
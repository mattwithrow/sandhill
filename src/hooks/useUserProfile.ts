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
      console.log('Client models:', client.models);

      // Check if UserProfile model exists
      if (!client.models.UserProfile) {
        console.error('UserProfile model not found in client.models');
        setError('Profile system not available. Please try again later.');
        return;
      }

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
      
      // Create a temporary profile object as fallback
      const tempProfile: UserProfile = {
        id: 'temp-' + Date.now(),
        userId: user?.userId || '',
        username: user?.signInDetails?.loginId || user?.username || '',
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
        projectDetails: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as UserProfile;
      
      console.log('Created temporary profile as fallback:', tempProfile);
      setProfile(tempProfile);
      setError(null); // Clear error since we have a fallback
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile?.id) {
      throw new Error('No profile to update');
    }

    // If this is a temporary profile, try to create a real one
    if (profile.id.startsWith('temp-')) {
      console.log('Attempting to create real profile from temporary one');
      try {
        const result = await client.models.UserProfile.create({
          userId: profile.userId,
          username: profile.username,
          userType: profile.userType,
          bio: updates.bio || profile.bio || '',
          experience: updates.experience || profile.experience || '',
          passions: updates.passions || profile.passions || '',
          values: updates.values || profile.values || '',
          contributionGoals: updates.contributionGoals || profile.contributionGoals || '',
          skills: updates.skills || profile.skills || '',
          linkedinUrl: updates.linkedinUrl || profile.linkedinUrl || '',
          githubUrl: updates.githubUrl || profile.githubUrl || '',
          portfolioUrl: updates.portfolioUrl || profile.portfolioUrl || '',
          twitterUrl: updates.twitterUrl || profile.twitterUrl || '',
          instagramUrl: updates.instagramUrl || profile.instagramUrl || '',
          websiteUrl: updates.websiteUrl || profile.websiteUrl || '',
          projectDetails: updates.projectDetails || profile.projectDetails || ''
        });
        setProfile(result.data);
        return result.data;
      } catch (createErr) {
        console.error('Error creating real profile:', createErr);
        // Update the temporary profile in memory
        const updatedTempProfile = { ...profile, ...updates };
        setProfile(updatedTempProfile);
        return updatedTempProfile;
      }
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
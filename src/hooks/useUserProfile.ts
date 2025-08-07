import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { 
  CompleteUserProfile, 
  validateAndMigrateProfile, 
  createCompleteProfile, 
  needsMigration 
} from '../utils/profileUtils';

type UserProfile = Schema["UserProfile"]["type"];

export const useUserProfile = () => {
  const { user, authStatus } = useAuthenticator();
  const [profile, setProfile] = useState<CompleteUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useUserProfile - Auth status:', authStatus);
    console.log('useUserProfile - User:', user);
    console.log('useUserProfile - User ID:', user?.userId);
    
    if (authStatus === 'authenticated' && user?.userId) {
      console.log('useUserProfile - Loading profile...');
      // Add a small delay to ensure Amplify is fully initialized
      setTimeout(() => {
        loadOrCreateProfile();
      }, 100);
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

      // Test client generation
      let client;
      try {
        client = generateClient<Schema>();
        console.log('Client generated successfully');
      } catch (clientError) {
        console.error('Failed to generate client:', clientError);
        throw new Error('Failed to generate Amplify client: ' + (clientError instanceof Error ? clientError.message : 'Unknown error'));
      }

      console.log('Client object:', client);
      console.log('Client models:', client.models);
      
      // Test if we can access Todo model first
      if (client.models.Todo) {
        console.log('Todo model is available');
      } else {
        console.error('Todo model is not available!');
      }
      
      // Check if UserProfile model exists
      if (!client.models.UserProfile) {
        console.error('UserProfile model is undefined!');
        console.log('Available models:', Object.keys(client.models || {}));
        console.log('Full client.models object:', JSON.stringify(client.models, null, 2));
        throw new Error('UserProfile model not found. Available models: ' + Object.keys(client.models || {}).join(', '));
      }

      console.log('UserProfile model found:', client.models.UserProfile);

      // Try to find existing profile
      let profiles;
      try {
        const result = await client.models.UserProfile.list({
          filter: {
            userId: { eq: user?.userId }
          }
        });
        profiles = result.data;
        console.log('Found profiles:', profiles.length);
      } catch (listError) {
        console.error('Error listing profiles:', listError);
        throw new Error('Failed to list profiles: ' + (listError instanceof Error ? listError.message : 'Unknown error'));
      }

      if (profiles.length > 0) {
        console.log('Using existing profile:', profiles[0]);
        // Validate and migrate the existing profile
        const migratedProfile = validateAndMigrateProfile(profiles[0]);
        setProfile(migratedProfile);
        
        // If the profile was migrated (missing fields), update it in the database
        if (needsMigration(profiles[0])) {
          console.log('Profile needs migration, updating in database...');
          try {
            const updateData = {
              id: migratedProfile.id,
              username: migratedProfile.username,
              userType: migratedProfile.userType,
              bio: migratedProfile.bio,
              experience: migratedProfile.experience,
              passions: migratedProfile.passions,
              values: migratedProfile.values,
              contributionGoals: migratedProfile.contributionGoals,
              skills: migratedProfile.skills,
              location: migratedProfile.location,
              linkedinUrl: migratedProfile.linkedinUrl,
              githubUrl: migratedProfile.githubUrl,
              portfolioUrl: migratedProfile.portfolioUrl,
              twitterUrl: migratedProfile.twitterUrl,
              instagramUrl: migratedProfile.instagramUrl,
              websiteUrl: migratedProfile.websiteUrl,
              projectDetails: migratedProfile.projectDetails,
            };
            
            const updatedResult = await client.models.UserProfile.update(updateData);
            console.log('Profile migrated and updated successfully:', updatedResult.data);
            setProfile(validateAndMigrateProfile(updatedResult.data));
          } catch (updateError) {
            console.error('Failed to migrate profile:', updateError);
            // Don't throw error here, the profile is still usable
          }
        }
      } else {
        console.log('Creating new profile for user:', user?.userId);
        
        // Create new profile if none exists
        try {
          const completeProfile = createCompleteProfile(user?.userId || '');
          const result = await client.models.UserProfile.create({
            userId: completeProfile.userId,
            username: completeProfile.username,
            userType: completeProfile.userType,
            bio: completeProfile.bio,
            experience: completeProfile.experience,
            passions: completeProfile.passions,
            values: completeProfile.values,
            contributionGoals: completeProfile.contributionGoals,
            skills: completeProfile.skills,
            location: completeProfile.location,
            linkedinUrl: completeProfile.linkedinUrl,
            githubUrl: completeProfile.githubUrl,
            portfolioUrl: completeProfile.portfolioUrl,
            twitterUrl: completeProfile.twitterUrl,
            instagramUrl: completeProfile.instagramUrl,
            websiteUrl: completeProfile.websiteUrl,
            projectDetails: completeProfile.projectDetails,
          });
          
          console.log('Created new profile:', result.data);
          setProfile(validateAndMigrateProfile(result.data));
        } catch (createError) {
          console.error('Error creating profile:', createError);
          throw new Error('Failed to create profile: ' + (createError instanceof Error ? createError.message : 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Error loading/creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<CompleteUserProfile>) => {
    if (!profile?.id) {
      throw new Error('No profile to update');
    }

    console.log('Updating profile with data:', updates);

    try {
      console.log('Updating existing profile with ID:', profile.id);
      
      // Generate client fresh for each request
      const client = generateClient<Schema>();
      
      // Check if UserProfile model exists
      if (!client.models.UserProfile) {
        throw new Error('UserProfile model not found');
      }
      
      const result = await client.models.UserProfile.update({
        id: profile.id,
        ...updates
      });
      
      console.log('Successfully updated profile:', result.data);
      const updatedProfile = validateAndMigrateProfile(result.data);
      setProfile(updatedProfile);
      return updatedProfile;
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
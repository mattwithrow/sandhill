import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// Generate client function to ensure fresh connection
const getClient = () => {
  try {
    return generateClient<Schema>();
  } catch (error) {
    console.error('Error generating client:', error);
    return null;
  }
};

type UserProfile = Schema["UserProfile"]["type"];

export const useUserProfile = () => {
  const { user, authStatus } = useAuthenticator();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test function to verify client is working
  const testClient = async () => {
    try {
      console.log('Testing client connection...');
      const client = getClient();
      
      if (!client) {
        console.log('❌ Failed to generate client');
        return false;
      }
      
      console.log('Client object:', client);
      console.log('Client models:', client.models);
      
      // Check if client is properly initialized
      if (!client.models) {
        console.log('❌ Client is not properly initialized');
        return false;
      }
      
      console.log('Available models:', Object.keys(client.models || {}));
      
      if (client.models.UserProfile) {
        console.log('✅ UserProfile model is available');
        return true;
      } else {
        console.log('❌ UserProfile model is NOT available');
        console.log('Available models:', Object.keys(client.models || {}));
        return false;
      }
    } catch (err) {
      console.error('❌ Client test failed:', err);
      return false;
    }
  };

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

      // Test client with retry mechanism
      let clientWorking = false;
      let retryCount = 0;
      const maxRetries = 5;
      
      // Initial delay to ensure backend is ready
      console.log('Waiting 3 seconds for backend to be fully ready...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      while (!clientWorking && retryCount < maxRetries) {
        console.log(`Client test attempt ${retryCount + 1}/${maxRetries}`);
        clientWorking = await testClient();
        
        if (!clientWorking) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Client test failed, retrying in 3 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
      
      if (!clientWorking) {
        setError('Backend connection failed after multiple attempts - please check your network connection and try refreshing the page');
        setIsLoading(false);
        return;
      }

      console.log('Loading profile for user:', user?.userId);

      const client = getClient();
      if (!client) {
        throw new Error('Failed to generate client');
      }

      // Try to find existing profile
      const profilePromise = client.models.UserProfile.list({
        filter: {
          userId: { eq: user?.userId }
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 10000)
      );
      
      const { data: profiles } = await Promise.race([profilePromise, timeoutPromise]) as any;

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
      const client = getClient();
      if (!client) {
        throw new Error('Failed to generate client');
      }
      
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
    refreshProfile: loadOrCreateProfile,
    testClient
  };
}; 
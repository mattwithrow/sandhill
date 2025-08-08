import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// Profile type matching database schema
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

      // Load from database with localStorage fallback
      let profileData = null;
      
      try {
        const client = generateClient<Schema>();
        console.log('✅ Database client generated successfully');
        
        // Check if UserProfile model is available
        if (!client.models.UserProfile) {
          throw new Error('UserProfile model not available in database schema');
        }
        
        console.log('✅ UserProfile model found, querying database...');
        
        // Query the database for user's profile
        const result = await client.models.UserProfile.list({
          filter: {
            email: { eq: user?.signInDetails?.loginId }
          }
        });
        
        console.log('✅ Database query successful, found profiles:', result.data.length);
        
        if (result.data.length > 0) {
          const dbProfile = result.data[0];
          console.log('📄 Found profile in database:', dbProfile);
          
          // Convert database profile to form data format
          profileData = {
            username: dbProfile.username || '',
            userType: (dbProfile.userType || 'both') as 'expert' | 'ventures' | 'both',
            bio: dbProfile.bio || '',
            experience: dbProfile.experience || '',
            skills: dbProfile.skills || '',
            location: dbProfile.location || ''
          };
          
          console.log('📄 Converted profile data:', profileData);
        } else {
          console.log('📝 No profile found in database for user:', user?.userId);
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        // Fallback to localStorage if database fails
        console.log('🔄 Falling back to localStorage...');
        
        const savedProfile = localStorage.getItem(`profile_${user?.userId}`);
        if (savedProfile) {
          try {
            profileData = JSON.parse(savedProfile);
            console.log('📄 Found fallback profile in localStorage:', profileData);
          } catch (error) {
            console.error('Error parsing localStorage profile:', error);
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
      
      if (!user?.userId) {
        throw new Error('No user ID available for updating profile');
      }
      
      const client = generateClient<Schema>();
      
      // Check if UserProfile model is available
      if (!client.models.UserProfile) {
        throw new Error('UserProfile model not available in database schema');
      }
      
      // Check if profile already exists
      const existingProfiles = await client.models.UserProfile.list({
        filter: {
          email: { eq: user.signInDetails?.loginId }
        }
      });
      
      if (existingProfiles.data.length > 0) {
        // Update existing profile
        const existingProfile = existingProfiles.data[0];
        
        await client.models.UserProfile.update({
          id: existingProfile.id,
          email: user.signInDetails?.loginId,
          username: updatedProfile.username,
          userType: updatedProfile.userType,
          bio: updatedProfile.bio,
          experience: updatedProfile.experience,
          skills: updatedProfile.skills,
          location: updatedProfile.location,
          // Set empty strings for optional fields
          passions: '',
          values: '',
          contributionGoals: '',
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          websiteUrl: '',
          projectDetails: ''
        });
        
        console.log('Profile updated successfully in database');
      } else {
        // Create new profile
        await client.models.UserProfile.create({
          email: user.signInDetails?.loginId,
          username: updatedProfile.username,
          userType: updatedProfile.userType,
          bio: updatedProfile.bio,
          experience: updatedProfile.experience,
          skills: updatedProfile.skills,
          location: updatedProfile.location,
          // Set empty strings for optional fields
          passions: '',
          values: '',
          contributionGoals: '',
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          websiteUrl: '',
          projectDetails: ''
        });
        
        console.log('Profile created successfully in database');
      }
      
      // Also save to localStorage as backup
      const profileJson = JSON.stringify(updatedProfile);
      localStorage.setItem(`profile_${user.userId}`, profileJson);
      
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
      
      if (!user?.userId) {
        throw new Error('No user ID available for creating profile');
      }
      
      const client = generateClient<Schema>();
      
      // Check if UserProfile model is available
      if (!client.models.UserProfile) {
        throw new Error('UserProfile model not available in database schema');
      }
      
      // Create new profile in database
      await client.models.UserProfile.create({
        email: user.signInDetails?.loginId,
        username: profileData.username,
        userType: profileData.userType,
        bio: profileData.bio,
        experience: profileData.experience,
        skills: profileData.skills,
        location: profileData.location,
        // Set empty strings for optional fields
        passions: '',
        values: '',
        contributionGoals: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        websiteUrl: '',
        projectDetails: ''
      });
      
      console.log('Profile created successfully in database');
      
      // Also save to localStorage as backup
      const profileJson = JSON.stringify(profileData);
      localStorage.setItem(`profile_${user.userId}`, profileJson);
      
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
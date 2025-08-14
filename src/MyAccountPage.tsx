import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { 
  ListUserProfilesQuery, 
  CreateUserProfileMutation, 
  UpdateUserProfileMutation,
  CreateUserProfileInput,
  UpdateUserProfileInput,
  UserProfileUserType
} from '../API';
import { listUserProfiles } from '../queries';
import { createUserProfile, updateUserProfile } from '../mutations';
import SkillsMultiSelect from './components/SkillsMultiSelect';
import MissionValuesMultiSelect from './components/MissionValuesMultiSelect';
import VentureInterestsMultiSelect from './components/VentureInterestsMultiSelect';
import PreferredEngagementMultiSelect from './components/PreferredEngagementMultiSelect';
import { 
  detectTimezoneFromLocation, 
  getUserTimezone, 
  formatTimezone, 
  getTimeInTimezone,
  isRemoteLocation 
} from './utils/locationUtils';
import { getMissionValueNames, getMissionValueIds } from './data/missionValues';
import { getVentureInterestNames, getVentureInterestIds } from './data/ventureInterests';
import { getEngagementTypeNames, getEngagementTypeIds } from './data/engagementTypes';
import { validateUsername } from './utils/usernameUtils';

const MyAccountPage: React.FC = (): React.ReactNode => {
  const { user, signOut, authStatus } = useAuthenticator();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<{
    username: string;
    userType: UserProfileUserType;
    bio: string;
    experience: string;
    skills: string;
    location: string;
    timezone: string;
    latitude?: number;
    longitude?: number;
    values: string;
    missionValuesAlignment: string;
    ventureInterests: string;
    preferredEngagement: string;
    timeCommitment: string;
    expertSupportNeeded: string;
    ventureInterestsDescription: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    websiteUrl: string;
    twitterUrl: string;
    instagramUrl: string;
  }>({
    username: '',
    userType: UserProfileUserType.both,
    bio: '',
    experience: '',
    skills: '',
    location: '',
    timezone: getUserTimezone(),
    values: '',
    missionValuesAlignment: '',
    ventureInterests: '',
    preferredEngagement: '',
    timeCommitment: '',
    expertSupportNeeded: '',
    ventureInterestsDescription: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    websiteUrl: '',
    twitterUrl: '',
    instagramUrl: ''
  });
  
  const [profile, setProfile] = useState<null | {
    username: string;
    userType: UserProfileUserType;
    bio: string;
    experience: string;
    skills: string;
    location: string;
    timezone: string;
    latitude?: number;
    longitude?: number;
    values: string;
    missionValuesAlignment: string;
    ventureInterests: string;
    preferredEngagement: string;
    timeCommitment: string;
    expertSupportNeeded: string;
    ventureInterestsDescription: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    websiteUrl: string;
    twitterUrl: string;
    instagramUrl: string;
  }>(null);

  const getUserTypeDisplay = (userType: UserProfileUserType) => {
    switch (userType) {
      case UserProfileUserType.expert:
        return 'Expert';
      case UserProfileUserType.ventures:
        return 'Venture';
      case UserProfileUserType.both:
        return 'Expert & Venture';
      default:
        return 'User';
    }
  };

  const getUserTypeDescription = (userType: UserProfileUserType) => {
    switch (userType) {
      case UserProfileUserType.expert:
        return 'Skilled professional ready to help bring ideas to life';
      case UserProfileUserType.ventures:
        return 'Building something meaningful and looking for the right people';
      case UserProfileUserType.both:
        return 'Both an expert and a venture builder - versatile collaborator';
      default:
        return 'Member of the Sandhill community';
    }
  };

  // Load profile from AWS database on component mount
  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('🔍 Starting MyAccountPage diagnostics...');
      
      const diagnostics = {
        authStatus,
        user: user ? {
          userId: user.userId,
          username: user.username,
          email: user.signInDetails?.loginId
        } : null,
        timestamp: new Date().toISOString()
      };

      setDebugInfo(diagnostics);
      console.log('📊 Auth Diagnostics:', diagnostics);

      // Try multiple ways to get the user email
      const userEmail = user?.signInDetails?.loginId || (user as any)?.email || user?.username;
      
      if (authStatus === 'authenticated' && user && userEmail) {
        console.log('✅ User is authenticated, loading profile from AWS...');
        console.log('✅ User email:', userEmail);
        
        try {
          setIsLoading(true);
          setError(null);
          
          // Load profile from AWS database using email
          let profileData = null;
          console.log('🔍 Searching for profile by email:', userEmail);
          
          try {
            const client = generateClient();
            console.log('✅ AWS API client generated successfully');
            
            // Query the AWS database for user's profile by email
            const result = await client.graphql({
              query: listUserProfiles,
              variables: {
                filter: {
                  email: { eq: userEmail }
                }
              }
            });
            
            console.log('✅ AWS GraphQL query successful, result:', result);
            
            const profiles = result.data?.listUserProfiles?.items || [];
            console.log('✅ AWS database query successful, found profiles:', profiles.length);
            
            if (profiles.length > 0) {
              const dbProfile = profiles[0];
              console.log('📄 Found profile in AWS database:', dbProfile);
              
              // Convert database profile to form data format
              profileData = {
                username: dbProfile.username || '',
                userType: dbProfile.userType || UserProfileUserType.both,
                bio: dbProfile.bio || '',
                experience: dbProfile.experience || '',
                skills: dbProfile.skills || '',
                location: dbProfile.location || '',
                values: dbProfile.values || '',
                missionValuesAlignment: '', // TODO: Add back after schema deployment
                ventureInterests: '', // TODO: Add back after schema deployment
                preferredEngagement: '', // TODO: Add back after schema deployment
                timeCommitment: '', // TODO: Add back after schema deployment
                expertSupportNeeded: '', // TODO: Add back after schema deployment
                ventureInterestsDescription: '', // TODO: Add back after schema deployment
                linkedinUrl: dbProfile.linkedinUrl || '',
                githubUrl: dbProfile.githubUrl || '',
                portfolioUrl: dbProfile.portfolioUrl || '',
                websiteUrl: dbProfile.websiteUrl || '',
                twitterUrl: dbProfile.twitterUrl || '',
                instagramUrl: dbProfile.instagramUrl || ''
              };
              
              console.log('📄 Converted profile data:', profileData);
            } else {
              console.log('📝 No profile found in AWS database for email:', userEmail);
            }
          } catch (dbError) {
            console.error('❌ AWS database error:', dbError);
            
            // Log detailed GraphQL error information
            if (dbError && typeof dbError === 'object' && 'errors' in dbError) {
              console.error('❌ GraphQL Errors:', (dbError as any).errors);
              const graphqlErrors = (dbError as any).errors;
              if (graphqlErrors && graphqlErrors.length > 0) {
                console.error('❌ GraphQL Error Details:', graphqlErrors.map((err: any) => ({
                  message: err.message,
                  path: err.path,
                  extensions: err.extensions
                })));
              }
            }
            
            // Fallback to localStorage if database fails
            console.log('🔄 Falling back to localStorage...');
            
            const savedProfile = localStorage.getItem(`profile_email_${userEmail}`);
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
            setFormData(profileData);
                     } else {
             console.log('📝 No saved profile found');
           }
           
           // Load timeCommitment from localStorage if available
           const savedTimeCommitment = localStorage.getItem(`timeCommitment_${userEmail}`);
           if (savedTimeCommitment && profileData) {
             profileData.timeCommitment = savedTimeCommitment;
             setFormData(prev => ({ ...prev, timeCommitment: savedTimeCommitment }));
           }
          
        } catch (err) {
          console.error('❌ Error loading profile:', err);
          setError(`Error loading profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      } else if (authStatus === 'authenticated' && !user) {
        console.log('⏳ Waiting for user object to load...');
        // Don't set loading to false here - keep loading until user object is available
      } else if (authStatus === 'unauthenticated') {
        console.log('🔒 User not authenticated');
        setIsLoading(false);
      } else {
        console.log('⏳ Waiting for authentication...');
        setIsLoading(false);
      }
    };

    runDiagnostics();
  }, [authStatus, user?.signInDetails?.loginId, user?.username, (user as any)?.email]);

  const handleSignOut = async () => {
    try {
      console.log('🔄 Attempting to sign out...');
      console.log('Current auth status:', authStatus);
      console.log('Current user:', user);
      
      await signOut();
      
      console.log('✅ Sign out completed successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      // Try alternative sign out method
      try {
        console.log('🔄 Trying alternative sign out method...');
        window.location.href = '/'; // Force redirect to home
      } catch (redirectError) {
        console.error('❌ Alternative sign out also failed:', redirectError);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validate username before submitting
    if (!usernameValidation.isValid) {
      setMessage(`Error: ${usernameValidation.message}`);
      return;
    }

    // Check username uniqueness before submitting
    if (!usernameUniqueness.isUnique) {
      setMessage('Error: Username is already taken. Please choose a different username.');
      return;
    }

    try {
      console.log('💾 Saving profile to AWS database...');
      console.log('🔍 Full user object:', user);
      console.log('🔍 User signInDetails:', user?.signInDetails);
      console.log('🔍 User email (signInDetails.loginId):', user?.signInDetails?.loginId);
      console.log('🔍 User email (user.email):', (user as any)?.email);
      console.log('🔍 User username:', user?.username);
      console.log('🔍 User userId:', user?.userId);
      console.log('Form data to save:', formData);
      
      // Try multiple ways to get the user email
      let userEmail = user?.signInDetails?.loginId || (user as any)?.email || user?.username;
      
      if (!userEmail) {
        throw new Error('No user email available for saving profile');
      }
      
      const client = generateClient();
      console.log('✅ AWS API client generated successfully');
      console.log('🔍 Checking for existing profile by email:', userEmail);
      
             // Check if profile already exists by email
       const existingResult = await client.graphql({
         query: listUserProfiles,
         variables: {
           filter: {
             email: { eq: userEmail }
           }
         }
       });
      
      const existingProfiles = existingResult.data?.listUserProfiles?.items || [];
      let savedProfile;
      
      if (existingProfiles.length > 0) {
        // Update existing profile
        console.log('📝 Updating existing profile in AWS...');
        const existingProfile = existingProfiles[0];
        
                 const updateInput: UpdateUserProfileInput = {
           id: existingProfile.id,
           email: userEmail,
           username: formData.username,
          userType: formData.userType,
          bio: formData.bio,
          experience: formData.experience,
          skills: formData.skills,
          location: formData.location,
          values: formData.values,
          // missionValuesAlignment: formData.missionValuesAlignment, // TODO: Add back after schema deployment
          // ventureInterests: formData.ventureInterests, // TODO: Add back after schema deployment
          // preferredEngagement: formData.preferredEngagement, // TODO: Add back after schema deployment
          // timeCommitment: formData.timeCommitment, // TODO: Add back after schema deployment
          // expertSupportNeeded: formData.expertSupportNeeded, // TODO: Add back after schema deployment
          linkedinUrl: formatSocialUrl('linkedin', formData.linkedinUrl),
          githubUrl: formatSocialUrl('github', formData.githubUrl),
          portfolioUrl: formatSocialUrl('website', formData.portfolioUrl),
          websiteUrl: formatSocialUrl('website', formData.websiteUrl),
          twitterUrl: formatSocialUrl('twitter', formData.twitterUrl),
          instagramUrl: formatSocialUrl('instagram', formData.instagramUrl),
          // Set empty strings for optional fields
          passions: '',
          contributionGoals: '',
          projectDetails: ''
        };
        
        const updateResult = await client.graphql({
          query: updateUserProfile,
          variables: {
            input: updateInput
          }
        });
        
        savedProfile = updateResult.data?.updateUserProfile;
        console.log('✅ Profile updated successfully in AWS:', savedProfile);
      } else {
        // Create new profile
        console.log('📝 Creating new profile in AWS...');
        
                 const createInput: CreateUserProfileInput = {
           email: userEmail,
           username: formData.username,
          userType: formData.userType,
          bio: formData.bio,
          experience: formData.experience,
          skills: formData.skills,
          location: formData.location,
          values: formData.values,
          // missionValuesAlignment: formData.missionValuesAlignment, // TODO: Add back after schema deployment
          // ventureInterests: formData.ventureInterests, // TODO: Add back after schema deployment
          // preferredEngagement: formData.preferredEngagement, // TODO: Add back after schema deployment
          // timeCommitment: formData.timeCommitment, // TODO: Add back after schema deployment
          // expertSupportNeeded: formData.expertSupportNeeded, // TODO: Add back after schema deployment
          linkedinUrl: formatSocialUrl('linkedin', formData.linkedinUrl),
          githubUrl: formatSocialUrl('github', formData.githubUrl),
          portfolioUrl: formatSocialUrl('website', formData.portfolioUrl),
          websiteUrl: formatSocialUrl('website', formData.websiteUrl),
          twitterUrl: formatSocialUrl('twitter', formData.twitterUrl),
          instagramUrl: formatSocialUrl('instagram', formData.instagramUrl),
          // Set empty strings for optional fields
          passions: '',
          contributionGoals: '',
          projectDetails: ''
        };
        
        const createResult = await client.graphql({
          query: createUserProfile,
          variables: {
            input: createInput
          }
        });
        
        savedProfile = createResult.data?.createUserProfile;
        console.log('✅ Profile created successfully in AWS:', savedProfile);
      }
      
      // Save to localStorage as backup (including timeCommitment)
      const profileJson = JSON.stringify(formData);
      localStorage.setItem(`profile_email_${userEmail}`, profileJson);
      
      // Also save timeCommitment separately for immediate access
      if (formData.timeCommitment) {
        localStorage.setItem(`timeCommitment_${userEmail}`, formData.timeCommitment);
      }
      console.log('✅ Also saved to localStorage as backup');
      
      console.log('✅ Profile saved successfully to AWS:', formData);
      setProfile(formData);
      setMessage('Profile saved successfully! (Stored in AWS database)');
      setIsEditing(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('❌ Error saving profile to AWS:', error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'errors' in error) {
        console.error('❌ GraphQL Errors:', (error as any).errors);
        const graphqlErrors = (error as any).errors;
        if (graphqlErrors && graphqlErrors.length > 0) {
          const errorMessage = graphqlErrors.map((err: any) => err.message).join(', ');
          setMessage(`GraphQL Error: ${errorMessage}`);
        } else {
          setMessage(`Error saving profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        setMessage(`Error saving profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [field]: field === 'userType' ? value as UserProfileUserType : value
      };
      
      // Auto-detect timezone when location changes
      if (field === 'location') {
        updatedData.timezone = detectTimezoneFromLocation(value);
      }
      
      return updatedData;
    });
  };

  const formatSocialUrl = (platform: string, value: string) => {
    if (!value) return '';
    
    // If it already has a protocol, return as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    
    // Handle usernames with @ symbol
    if (value.startsWith('@')) {
      const username = value.substring(1);
      switch (platform) {
        case 'linkedin':
          return `https://linkedin.com/in/${username}`;
        case 'github':
          return `https://github.com/${username}`;
        case 'twitter':
          return `https://twitter.com/${username}`;
        case 'instagram':
          return `https://instagram.com/${username}`;
        default:
          return value;
      }
    }
    
    // Handle URLs without protocol
    if (value.includes('.com') || value.includes('.io') || value.includes('.org') || value.includes('.net')) {
      return `https://${value}`;
    }
    
    // Handle platform-specific URLs
    switch (platform) {
      case 'linkedin':
        if (value.includes('linkedin.com')) {
          return `https://${value}`;
        }
        return `https://linkedin.com/in/${value}`;
      case 'github':
        if (value.includes('github.com')) {
          return `https://github.com/${value}`;
        }
        return `https://github.com/${value}`;
      case 'twitter':
        if (value.includes('twitter.com')) {
          return `https://${value}`;
        }
        return `https://twitter.com/${value}`;
      case 'instagram':
        if (value.includes('instagram.com')) {
          return `https://${value}`;
        }
        return `https://instagram.com/${value}`;
      default:
        return value;
    }
  };

  // Check if username is unique in the database
  const checkUsernameUniqueness = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) return true; // Skip check for invalid usernames
    
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listUserProfiles,
        variables: {
          filter: {
            username: { eq: username }
          }
        }
      });
      
      const existingProfiles = result.data?.listUserProfiles?.items || [];
      
      // If we're editing an existing profile, exclude the current user's profile from the check
      if (profile && profile.username === username) {
        return existingProfiles.length <= 1; // Should only find the current user's profile
      }
      
      return existingProfiles.length === 0; // Username is unique if no profiles found
    } catch (error) {
      console.error('Error checking username uniqueness:', error);
      // If there's an error checking, we'll let it pass and handle it during submission
      return true;
    }
  };

  // Get username validation state
  const usernameValidation = validateUsername(formData.username);

  // Debounced username uniqueness check
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameUniqueness, setUsernameUniqueness] = useState<{
    isUnique: boolean;
    message: string;
  }>({ isUnique: true, message: '' });

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username && usernameValidation.isValid) {
        setIsCheckingUsername(true);
        const isUnique = await checkUsernameUniqueness(formData.username);
        setUsernameUniqueness({
          isUnique,
          message: isUnique ? 'Username is available' : 'Username is already taken'
        });
        setIsCheckingUsername(false);
      } else {
        setUsernameUniqueness({ isUnique: true, message: '' });
      }
    };

    // Debounce the check to avoid too many API calls
    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, usernameValidation.isValid, profile]);

  // When editing starts, populate form with existing profile data
  useEffect(() => {
    if (isEditing && profile) {
      setFormData(profile);
    }
  }, [isEditing, profile]);

  if (isLoading) {
    return (
      <div className="my-account-page">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Profile</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-page">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 max-w-2xl mx-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Loading Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              
              {/* Debug Information */}
              <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                <h3 className="font-semibold mb-2">Debug Information:</h3>
                <pre className="text-xs text-gray-700 overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Profile Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            {profile && (
              <div className="mb-4">
                <span className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {getUserTypeDisplay(profile.userType)}
                </span>
              </div>
            )}
            <h1 className="hero-title">
              Hello, <span className="gradient-text">
                {profile?.username || user?.username || 'User'}
              </span>!
            </h1>
            <p className="hero-subtitle">
              {profile ? getUserTypeDescription(profile.userType) : 'Welcome to your Sandhill profile. This is where your journey begins.'}
            </p>
            
            <div className="cta-buttons">
              {profile && (
                <button
                  onClick={() => navigate(`/profile/${profile.username}`)}
                  className="btn btn-outline btn-large"
                >
                  View Public Profile
                </button>
              )}
              <button
                onClick={() => navigate('/experts')}
                className="btn btn-primary btn-large"
              >
                Find Experts
              </button>
              <button
                onClick={() => navigate('/ventures')}
                className="btn btn-outline btn-large"
              >
                Discover Ventures
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">

          {/* Success/Error Messages */}
          {message && (
            <div className={`mb-8 p-6 rounded-2xl border-2 ${
              message.includes('Error') 
                ? 'bg-red-50 border-red-200 text-red-800 shadow-lg' 
                : 'bg-green-50 border-green-200 text-green-800 shadow-lg'
            }`}>
              <div className="flex items-center">
                <div className={`text-2xl mr-3 ${message.includes('Error') ? '🔴' : '✅'}`}></div>
                <p className="font-medium text-lg">{message}</p>
              </div>
            </div>
          )}

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200 shadow-lg">
              <h3 className="font-semibold mb-3 text-blue-800 text-lg">Debug Info:</h3>
              <pre className="text-sm text-blue-700 overflow-auto bg-blue-100 p-4 rounded-lg">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {/* Profile Content */}
          {!isEditing ? (
            <section className="section">
              <div className="content-card">
                <div className="section-header-left">
                  <div className="eyebrow">Your Profile</div>
                  <h2 className="section-title">Manage your personal information and preferences</h2>
                </div>

                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    {profile ? 'Edit Profile' : 'Create Profile'}
                  </button>
                </div>

                {profile ? (
                  <div className="space-y-8">
                    {/* Username and User Type */}
                    <div className="grid-2">
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Username</h3>
                        <p className="text-gray-700 text-lg">{profile.username}</p>
                      </div>
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">User Type</h3>
                        <p className="text-gray-700 text-lg capitalize">{profile.userType}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bio</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
                      </div>
                    )}

                    {/* Values */}
                    {profile.values && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Values</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.values}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {profile.experience && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Experience</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.experience}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {profile.skills && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 hover:from-orange-200 hover:to-teal-200 transition-all duration-300"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mission & Values Alignment */}
                    {profile.missionValuesAlignment && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mission & Values Alignment</h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {profile.missionValuesAlignment.split(',').map((value, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200"
                            >
                              {value.trim()}
                            </span>
                          ))}
                        </div>
                        {profile.values && (
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.values}</p>
                        )}
                      </div>
                    )}

                    {/* Venture Interests */}
                    {profile.ventureInterests && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Venture Interests</h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.ventureInterests.split(',').map((interest, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                            >
                              {interest.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred Engagement */}
                    {profile.preferredEngagement && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferred Engagement</h3>
                        <div className="flex flex-wrap gap-3">
                          {profile.preferredEngagement.split(',').map((engagement, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
                            >
                              {engagement.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                                         {/* Location, Time Commitment, and Expert Support */}
                     <div className="grid-2">
                       {profile.location && (
                         <div className="feature-card">
                           <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                           <p className="text-gray-700 text-lg">{profile.location}</p>
                           {profile.timezone && (
                             <p className="text-sm text-gray-500 mt-1">
                               {formatTimezone(profile.timezone)}
                               {!isRemoteLocation(profile.location) && (
                                 <span className="ml-2">
                                   • {getTimeInTimezone(profile.timezone)}
                                 </span>
                               )}
                             </p>
                           )}
                         </div>
                       )}
                       {profile.timeCommitment && (profile.userType === 'expert' || profile.userType === 'both') && (
                         <div className="feature-card">
                           <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Commitment</h3>
                           <p className="text-gray-700 text-lg">{profile.timeCommitment}</p>
                         </div>
                       )}
                     </div>

                     {/* Expert Support Needed (for Ventures and Both) */}
                     {profile.expertSupportNeeded && (profile.userType === 'ventures' || profile.userType === 'both') && (
                       <div className="feature-card">
                         <h3 className="text-lg font-semibold text-gray-800 mb-3">What I'm Building</h3>
                         <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.expertSupportNeeded}</p>
                       </div>
                     )}

                     {/* Venture Interests Description (for Experts and Both) */}
                     {profile.ventureInterestsDescription && (profile.userType === 'expert' || profile.userType === 'both') && (
                       <div className="feature-card">
                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Ventures I Want to Get Involved With</h3>
                         <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.ventureInterestsDescription}</p>
                       </div>
                     )}

                    {/* Social Links */}
                    {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl || profile.websiteUrl || profile.twitterUrl || profile.instagramUrl) && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Links</h3>
                        <ul className="space-y-3">
                          {profile.linkedinUrl && (
                            <li>
                              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                                <span className="w-4 h-4 mr-2">🔗</span>
                                LinkedIn
                              </a>
                            </li>
                          )}
                          {profile.githubUrl && (
                            <li>
                              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors flex items-center">
                                <span className="w-4 h-4 mr-2">🔗</span>
                                GitHub
                              </a>
                            </li>
                          )}
                          {profile.portfolioUrl && (
                            <li>
                              <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition-colors flex items-center">
                                <span className="w-4 h-4 mr-2">🔗</span>
                                Portfolio
                              </a>
                            </li>
                          )}
                          {profile.websiteUrl && (
                            <li>
                              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors flex items-center">
                                <span className="w-4 h-4 mr-2">🔗</span>
                                Website
                              </a>
                            </li>
                          )}
                          {profile.twitterUrl && (
                            <li>
                              <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors flex items-center">
                                <span className="w-4 h-4 mr-2">🔗</span>
                                Twitter
                              </a>
                            </li>
                          )}
                          {profile.instagramUrl && (
                            <li>
                              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors flex items-center">
                                <span className="w-4 h-4 mr-2">🔗</span>
                                Instagram
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Sandhill!</h3>
                      <p className="text-gray-600 mb-6">Create your profile to get started and connect with amazing people.</p>
                      <p className="text-sm text-gray-500 mb-8">
                        This will help us connect you with the right people and opportunities.
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-primary btn-large"
                      >
                        Create Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          ) : (
            /* Edit Form */
            <section className="section">
              <div className="content-card">
                <div className="section-header-left">
                  <div className="eyebrow">{profile ? 'Edit Your Profile' : 'Create Your Profile'}</div>
                  <h2 className="section-title">Update your information to help us connect you better</h2>
                </div>

                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information - 2 Columns */}
                  <div className="grid-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => {
                          const value = e.target.value;
                          const validValue = value.replace(/[^a-zA-Z0-9_-]/g, '');
                          handleInputChange('username', validValue);
                        }}
                        placeholder="your-username_123"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                          formData.username 
                            ? usernameValidation.isValid && usernameUniqueness.isUnique
                              ? 'border-green-300 focus:ring-green-500' 
                              : 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-orange-500'
                        }`}
                        required
                      />
                      {formData.username && (
                        <div className="mt-2 space-y-1">
                          {/* Format validation message */}
                          <div className={`text-sm ${
                            usernameValidation.isValid ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {usernameValidation.message}
                          </div>
                          
                          {/* Uniqueness check message */}
                          {usernameValidation.isValid && (
                            <div className={`text-sm flex items-center gap-2 ${
                              isCheckingUsername 
                                ? 'text-blue-600' 
                                : usernameUniqueness.isUnique 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                            }`}>
                              {isCheckingUsername ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                  Checking availability...
                                </>
                              ) : (
                                <>
                                  {usernameUniqueness.isUnique ? '✓' : '✗'} {usernameUniqueness.message}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        Only letters, numbers, hyphens (-), and underscores (_). 3-30 characters.
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        User Type *
                      </label>
                      <select
                        value={formData.userType}
                        onChange={(e) => handleInputChange('userType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value={UserProfileUserType.expert}>Expert</option>
                        <option value={UserProfileUserType.ventures}>Ventures</option>
                        <option value={UserProfileUserType.both}>Both</option>
                      </select>
                    </div>
                  </div>

                  {/* Location and Time Commitment - 2 Columns */}
                  <div className="grid-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="San Francisco, CA or Remote"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      {formData.location && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Detected timezone:</span> {formatTimezone(formData.timezone)} 
                          {!isRemoteLocation(formData.location) && (
                            <span className="ml-2">
                              (Current time: {getTimeInTimezone(formData.timezone)})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {(formData.userType === 'expert' || formData.userType === 'both') && (
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                          Time Commitment
                        </label>
                        <select
                          value={formData.timeCommitment}
                          onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select time commitment</option>
                          <option value="1-5 hours per week">1-5 hours per week</option>
                          <option value="5-10 hours per week">5-10 hours per week</option>
                          <option value="10-20 hours per week">10-20 hours per week</option>
                          <option value="20+ hours per week">20+ hours per week</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Experience
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="What's your background and experience?"
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                    />
                  </div>

                  {/* Skills - Multi-column Layout */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Skills
                    </label>
                    <div className="skills-multi-select-container">
                      <SkillsMultiSelect
                        selectedSkills={formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []}
                        onChange={(skills) => handleInputChange('skills', skills.join(', '))}
                        placeholder="Select your skills..."
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Mission & Values Alignment */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Mission & Values Alignment
                    </label>
                    <MissionValuesMultiSelect
                      selectedValues={formData.missionValuesAlignment ? formData.missionValuesAlignment.split(',').map(s => s.trim()).filter(Boolean) : []}
                      onChange={(values) => handleInputChange('missionValuesAlignment', values.join(', '))}
                      placeholder="Select mission and values that align with your goals..."
                    />
                    <div className="mt-2">
                      <textarea
                        value={formData.values}
                        onChange={(e) => handleInputChange('values', e.target.value)}
                        placeholder="Add any additional values or mission details that are important to you..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>
                  </div>

                  {/* Venture Interests */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Types of Ventures You're Interested In
                    </label>
                    <VentureInterestsMultiSelect
                      selectedInterests={formData.ventureInterests ? formData.ventureInterests.split(',').map(s => s.trim()).filter(Boolean) : []}
                      onChange={(interests) => handleInputChange('ventureInterests', interests.join(', '))}
                      placeholder="Select venture types and industries that interest you..."
                    />
                  </div>

                  {/* Preferred Engagement */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Preferred Engagement Types
                    </label>
                    <PreferredEngagementMultiSelect
                      selectedEngagements={formData.preferredEngagement ? formData.preferredEngagement.split(',').map(s => s.trim()).filter(Boolean) : []}
                      onChange={(engagements) => handleInputChange('preferredEngagement', engagements.join(', '))}
                      placeholder="Select how you'd like to engage with ventures..."
                    />
                  </div>

                  {/* User Type Specific Fields */}
                  {(formData.userType === 'ventures' || formData.userType === 'both') && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Tell us as much as you want about what you're trying to do
                      </label>
                      <textarea
                        value={formData.expertSupportNeeded}
                        onChange={(e) => handleInputChange('expertSupportNeeded', e.target.value)}
                        placeholder="What type of expert support are you looking for? (e.g., technical development, design, marketing, business strategy, etc.)"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>
                  )}

                  {(formData.userType === 'expert' || formData.userType === 'both') && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        What type of ventures do you want to get involved with?
                      </label>
                      <textarea
                        value={formData.ventureInterestsDescription}
                        onChange={(e) => handleInputChange('ventureInterestsDescription', e.target.value)}
                        placeholder="Describe the types of ventures, projects, or ideas you're interested in working on..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>
                  )}

                  {/* Links - Compact Layout */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Links</h3>
                    <div className="grid-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          placeholder="linkedin.com/in/yourprofile or @yourprofile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub
                        </label>
                        <input
                          type="text"
                          value={formData.githubUrl}
                          onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                          placeholder="github.com/yourusername or @yourusername"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website/Portfolio
                        </label>
                        <input
                          type="text"
                          value={formData.websiteUrl || formData.portfolioUrl}
                          onChange={(e) => {
                            handleInputChange('websiteUrl', e.target.value);
                            handleInputChange('portfolioUrl', e.target.value);
                          }}
                          placeholder="yourwebsite.com or yourportfolio.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="text"
                          value={formData.twitterUrl}
                          onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                          placeholder="@yourusername or twitter.com/yourusername"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <input
                          type="text"
                          value={formData.instagramUrl}
                          onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                          placeholder="@yourusername or instagram.com/yourusername"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-8">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {profile ? 'Update Profile' : 'Create Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* Privacy Statement */}
          <section className="section">
            <div className="cta-section">
              <h3 className="section-title">Your Privacy Matters</h3>
              <p className="cta-text">
                We won't sell your information because like you, we want to see greatness being built. 
                Your data is secure and will only be used to connect you with the right opportunities and people.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage; 
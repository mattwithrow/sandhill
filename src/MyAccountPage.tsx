import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
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

const MyAccountPage: React.FC = (): React.ReactNode => {
  const { user, signOut, authStatus } = useAuthenticator();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    userType: UserProfileUserType.both,
    bio: '',
    experience: '',
    skills: '',
    location: ''
  });
  
  const [profile, setProfile] = useState<null | {
    username: string;
    userType: UserProfileUserType;
    bio: string;
    experience: string;
    skills: string;
    location: string;
  }>(null);

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

      if (authStatus === 'authenticated' && user?.userId) {
        console.log('✅ User is authenticated, loading profile from AWS...');
        
        try {
          setIsLoading(true);
          setError(null);
          
          // Load profile from AWS database
          let profileData = null;
          console.log('🔍 Starting AWS database profile loading process...');
          console.log('Current user ID:', user.userId);
          console.log('Current user email:', user.signInDetails?.loginId);
          
          try {
            const client = generateClient();
            console.log('✅ AWS API client generated successfully');
            
            // Query the AWS database for user's profile
            const result = await client.graphql({
              query: listUserProfiles,
              variables: {
                filter: {
                  userId: { eq: user.userId }
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
                 location: dbProfile.location || ''
               };
              
              console.log('📄 Converted profile data:', profileData);
            } else {
              console.log('📝 No profile found in AWS database for user:', user.userId);
            }
          } catch (dbError) {
            console.error('❌ AWS database error:', dbError);
            // Fallback to localStorage if database fails
            console.log('🔄 Falling back to localStorage...');
            
            const savedProfile = localStorage.getItem(`profile_${user.userId}`);
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
            // Debug: Show all localStorage keys
            console.log('🔍 All localStorage keys:', Object.keys(localStorage));
            const profileKeys = Object.keys(localStorage).filter(key => key.startsWith('profile_'));
            console.log('🔍 Profile-related keys:', profileKeys);
            profileKeys.forEach(key => {
              console.log(`🔍 Key: ${key}, Value:`, localStorage.getItem(key));
            });
          }
          
        } catch (err) {
          console.error('❌ Error loading profile:', err);
          setError(`Error loading profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      } else if (authStatus === 'unauthenticated') {
        console.log('❌ User is not authenticated');
        setError('User is not authenticated');
        setIsLoading(false);
      } else {
        console.log('⏳ Waiting for authentication...');
        setIsLoading(false);
      }
    };

    runDiagnostics();
  }, [authStatus, user?.userId]);

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

    try {
      console.log('💾 Saving profile to AWS database...');
      console.log('User ID:', user?.userId);
      console.log('User email:', user?.signInDetails?.loginId);
      console.log('Form data to save:', formData);
      
      if (!user?.userId) {
        throw new Error('No user ID available for saving profile');
      }
      
      const client = generateClient();
      console.log('✅ AWS API client generated successfully');
      console.log('🔍 Current auth status:', authStatus);
      console.log('🔍 Current user:', user);
      console.log('🔍 User ID for profile:', user.userId);
      
      console.log('✅ AWS client ready, checking for existing profile...');
      
      // Check if profile already exists
      const existingResult = await client.graphql({
        query: listUserProfiles,
        variables: {
          filter: {
            userId: { eq: user.userId }
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
          userId: user.userId,
          username: formData.username,
          userType: formData.userType,
          bio: formData.bio,
          experience: formData.experience,
          skills: formData.skills,
          location: formData.location,
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
          userId: user.userId,
          username: formData.username,
          userType: formData.userType,
          bio: formData.bio,
          experience: formData.experience,
          skills: formData.skills,
          location: formData.location,
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
        };
        
        console.log('🔍 Create input data:', createInput);
        
        const createResult = await client.graphql({
          query: createUserProfile,
          variables: {
            input: createInput
          }
        });
        
        savedProfile = createResult.data?.createUserProfile;
        console.log('✅ Profile created successfully in AWS:', savedProfile);
      }
      
      // Also save to localStorage as backup
      const profileJson = JSON.stringify(formData);
      localStorage.setItem(`profile_${user.userId}`, profileJson);
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
    setFormData(prev => ({
      ...prev,
      [field]: field === 'userType' ? value as UserProfileUserType : value
    }));
  };

  // When editing starts, populate form with existing profile data
  useEffect(() => {
    if (isEditing && profile) {
      setFormData(profile);
    }
  }, [isEditing, profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Profile</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Hello, <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">
                {user?.username || 'User'}
              </span>!
            </h1>
            <p className="text-gray-600 mb-6">Welcome to your Sandhill profile</p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-100 border border-red-300 text-red-800' 
                : 'bg-green-100 border border-green-300 text-green-800'
            }`}>
              {message}
            </div>
          )}

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-800">Debug Info:</h3>
              <pre className="text-xs text-blue-700 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {/* Profile Content */}
          {!isEditing ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-teal-700 transition-all font-medium"
                >
                  {profile ? 'Edit Profile' : 'Create Profile'}
                </button>
              </div>

              {profile ? (
                <div className="space-y-6">
                  {/* Username and User Type */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Username</h3>
                      <p className="text-gray-800">{profile.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">User Type</h3>
                      <p className="text-gray-800 capitalize">{profile.userType}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Bio</h3>
                      <p className="text-gray-800 whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {profile.experience && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Experience</h3>
                      <p className="text-gray-800 whitespace-pre-wrap">{profile.experience}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {profile.skills && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {profile.location && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
                      <p className="text-gray-800">{profile.location}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Welcome to Sandhill! Create your profile to get started.</p>
                  <p className="text-sm text-gray-500 mb-6">
                    This will help us connect you with the right people and opportunities.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-teal-700 transition-all font-medium"
                  >
                    Create Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Edit Form */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{profile ? 'Edit Your Profile' : 'Create Your Profile'}</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Your username"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      User Type *
                    </label>
                    <select
                      value={formData.userType}
                      onChange={(e) => handleInputChange('userType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={UserProfileUserType.expert}>Expert</option>
                      <option value={UserProfileUserType.ventures}>Ventures</option>
                      <option value={UserProfileUserType.both}>Both</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="What's your background and experience?"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="JavaScript, React, Python, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="San Francisco, CA or Remote"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-teal-700 transition-all font-medium"
                  >
                    {profile ? 'Update Profile' : 'Create Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage; 
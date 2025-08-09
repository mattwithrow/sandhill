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
                location: dbProfile.location || ''
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
           email: userEmail,
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
      localStorage.setItem(`profile_email_${userEmail}`, profileJson);
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
            <h1 className="hero-title">
              Hello, <span className="gradient-text">
                {profile?.username || user?.username || 'User'}
              </span>! 👋
            </h1>
            <p className="hero-subtitle">
              Welcome to your Sandhill profile. This is where your journey begins.
            </p>
            
            <div className="cta-buttons">
              <button
                onClick={handleSignOut}
                className="btn btn-outline"
              >
                Sign Out
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
                <div className="section-header">
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

                    {/* Location */}
                    {profile.location && (
                      <div className="feature-card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                        <p className="text-gray-700 text-lg">{profile.location}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="text-6xl mb-6">🚀</div>
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
                <div className="section-header">
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
                  {/* Basic Information */}
                  <div className="grid-2">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Your username"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        required
                      />
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

                  {/* Skills */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="JavaScript, React, Python, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Location */}
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
              <div className="text-4xl mb-4">🔒</div>
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
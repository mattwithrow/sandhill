import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const MyAccountPage: React.FC = (): React.ReactNode => {
  const { user, signOut, authStatus } = useAuthenticator();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    userType: 'both' as 'expert' | 'ventures' | 'both',
    bio: '',
    experience: '',
    skills: '',
    location: ''
  });
  
  const [profile, setProfile] = useState<null | typeof formData>(null);

  // Load profile from localStorage on component mount
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
        console.log('✅ User is authenticated, loading profile...');
        
        try {
          setIsLoading(true);
          setError(null);
          
          // Load profile from localStorage with multiple fallback strategies
          let profileData = null;
          
          // Try loading by current user ID first
          const savedProfile = localStorage.getItem(`profile_${user.userId}`);
          if (savedProfile) {
            try {
              profileData = JSON.parse(savedProfile);
              console.log('📄 Found saved profile by user ID:', profileData);
            } catch (error) {
              console.error('Error parsing profile by user ID:', error);
            }
          }
          
          // If not found by user ID, try loading by email (more stable)
          if (!profileData && user.signInDetails?.loginId) {
            const emailProfile = localStorage.getItem(`profile_email_${user.signInDetails.loginId}`);
            if (emailProfile) {
              try {
                profileData = JSON.parse(emailProfile);
                console.log('📄 Found saved profile by email:', profileData);
                // Save it with the current user ID for future use
                localStorage.setItem(`profile_${user.userId}`, emailProfile);
              } catch (error) {
                console.error('Error parsing profile by email:', error);
              }
            }
          }
          
          // If still not found, try loading the most recent profile
          if (!profileData) {
            const allKeys = Object.keys(localStorage);
            const profileKeys = allKeys.filter(key => key.startsWith('profile_'));
            if (profileKeys.length > 0) {
              // Get the most recent profile (you could also check timestamps if needed)
              const mostRecentKey = profileKeys[profileKeys.length - 1];
              const mostRecentProfile = localStorage.getItem(mostRecentKey);
              if (mostRecentProfile) {
                try {
                  profileData = JSON.parse(mostRecentProfile);
                  console.log('📄 Found saved profile by fallback:', profileData);
                  // Save it with the current user ID for future use
                  localStorage.setItem(`profile_${user.userId}`, mostRecentProfile);
                } catch (error) {
                  console.error('Error parsing fallback profile:', error);
                }
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
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      console.log('💾 Saving profile to localStorage...');
      
      // Save to localStorage with multiple keys for better persistence
      if (user?.userId) {
        const profileJson = JSON.stringify(formData);
        
        // Save with user ID
        localStorage.setItem(`profile_${user.userId}`, profileJson);
        
        // Also save with email for better persistence across sessions
        if (user.signInDetails?.loginId) {
          localStorage.setItem(`profile_email_${user.signInDetails.loginId}`, profileJson);
        }
        
        // Save timestamp for tracking
        localStorage.setItem(`profile_timestamp_${user.userId}`, Date.now().toString());
      }
      
      console.log('✅ Profile saved successfully:', formData);
      setProfile(formData);
      setMessage('Profile saved successfully! (Stored locally)');
      setIsEditing(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setMessage(`Error saving profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
                      onChange={(e) => handleInputChange('userType', e.target.value as 'expert' | 'ventures' | 'both')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="expert">Expert</option>
                      <option value="ventures">Ventures</option>
                      <option value="both">Both</option>
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
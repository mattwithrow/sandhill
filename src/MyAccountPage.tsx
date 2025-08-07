import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useUserProfile } from './hooks/useUserProfile';

const MyAccountPage: React.FC = () => {
  const { user, signOut } = useAuthenticator();
  const { profile, isLoading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    userType: 'both' as 'expert' | 'ventures' | 'both',
    bio: '',
    experience: '',
    passions: '',
    values: '',
    contributionGoals: '',
    skills: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    websiteUrl: '',
    projectDetails: ''
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        userType: profile.userType || 'both',
        bio: profile.bio || '',
        experience: profile.experience || '',
        passions: profile.passions || '',
        values: profile.values || '',
        contributionGoals: profile.contributionGoals || '',
        skills: profile.skills || '',
        location: profile.location || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        twitterUrl: profile.twitterUrl || '',
        instagramUrl: profile.instagramUrl || '',
        websiteUrl: profile.websiteUrl || '',
        projectDetails: profile.projectDetails || ''
      });
    }
  }, [profile]);

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
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Loading Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
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
                {profile?.username || user?.username || 'User'}
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

          {/* Profile Content */}
          {!isEditing ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-teal-700 transition-all font-medium"
                >
                  Edit Profile
                </button>
              </div>

              {profile ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Username</h3>
                      <p className="text-gray-600">{profile.username || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">User Type</h3>
                      <p className="text-gray-600 capitalize">{profile.userType || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
                      <p className="text-gray-600">{profile.bio}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {profile.experience && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                      <p className="text-gray-600">{profile.experience}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {profile.skills && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.split(',').map((skill, index) => (
                          <span key={index} className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {profile.location && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                      <p className="text-gray-600">{profile.location}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No profile data found. Create your profile to get started!</p>
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
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
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
                    Save Profile
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
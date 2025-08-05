import React, { useState, useEffect } from 'react';
import { useUserProfile } from './hooks/useUserProfile';

const MyAccountPage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, refreshProfile } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    userType: 'both' as 'builder' | 'ideas' | 'both',
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

  // Update form data when profile loads or when editing starts
  useEffect(() => {
    if (profile) {
      console.log('Setting form data from profile:', profile);
      setFormData({
        username: profile.username || '',
        userType: profile.userType || 'both',
        bio: profile.bio || '',
        experience: profile.experience || '',
        passions: profile.passions || '',
        values: profile.values || '',
        contributionGoals: profile.contributionGoals || '',
        skills: profile.skills || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        twitterUrl: profile.twitterUrl || '',
        instagramUrl: profile.instagramUrl || '',
        websiteUrl: profile.websiteUrl || '',
        projectDetails: profile.projectDetails || ''
      });
    } else if (isEditing) {
      // Initialize form data for new users when they start editing
      console.log('Initializing form data for new user');
      setFormData({
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
    }
  }, [profile, isEditing]);

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  // Refresh profile data when component mounts
  useEffect(() => {
    if (!isLoading && profile) {
      console.log('Refreshing profile data on component mount');
      refreshProfile();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      console.log('Submitting form data:', formData);
      const updatedProfile = await updateProfile({
        username: formData.username,
        userType: formData.userType,
        bio: formData.bio,
        experience: formData.experience,
        passions: formData.passions,
        values: formData.values,
        contributionGoals: formData.contributionGoals,
        skills: formData.skills,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        twitterUrl: formData.twitterUrl,
        instagramUrl: formData.instagramUrl,
        websiteUrl: formData.websiteUrl,
        projectDetails: formData.projectDetails
      });
      
      console.log('Profile updated successfully:', updatedProfile);
      setMessage('Profile saved successfully!');
      setIsEditing(false);
      
      // Refresh the profile to ensure we have the latest data
      await refreshProfile();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSkillsArray = (skillsString: string | null | undefined): string[] => {
    return skillsString ? skillsString.split(',').map(s => s.trim()).filter(s => s) : [];
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      const currentSkills = getSkillsArray(prev.skills);
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
      return {
        ...prev,
        skills: newSkills.join(', ')
      };
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    // Reset form data to current profile data
    if (profile) {
      console.log('Resetting form data to current profile:', profile);
      setFormData({
        username: profile.username || '',
        userType: profile.userType || 'both',
        bio: profile.bio || '',
        experience: profile.experience || '',
        passions: profile.passions || '',
        values: profile.values || '',
        contributionGoals: profile.contributionGoals || '',
        skills: profile.skills || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        twitterUrl: profile.twitterUrl || '',
        instagramUrl: profile.instagramUrl || '',
        websiteUrl: profile.websiteUrl || '',
        projectDetails: profile.projectDetails || ''
      });
    }
  };

  const handleRetry = () => {
    refreshProfile();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Profile</h2>
              <p className="text-gray-600 mb-6">Setting up your professional space...</p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-teal-600 transition-all font-medium"
              >
                🔄 Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Loading Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleRetry}
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
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Sandhill!</h2>
                <p className="text-gray-600 mb-6">
                  Let's set up your professional profile to help you connect with the right people and build what matters.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-teal-600 transition-all font-medium text-lg shadow-lg"
                >
                  Set Up Your Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-white via-orange-50 to-teal-50 rounded-3xl shadow-2xl p-10 mb-10 border border-orange-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-teal-600 bg-clip-text text-transparent mb-4">
                  My Account
                </h1>
                <p className="text-gray-700 text-xl font-medium">
                  ✨ Manage your professional profile and connect with the Sandhill community
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="mt-6 md:mt-0 bg-gradient-to-r from-orange-500 via-red-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:via-red-600 hover:to-teal-600 transition-all font-bold text-lg shadow-xl transform hover:scale-105"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className={`mb-8 p-6 rounded-2xl shadow-lg ${
              message.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  message.includes('Error') ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {message.includes('Error') ? '❌' : '✅'}
                </div>
                <span className="font-medium">{message}</span>
              </div>
            </div>
          )}

          {/* Debug Form Data (temporary) */}
          {isEditing && (
            <div className="mb-8 p-6 rounded-2xl shadow-lg bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">Debug Info:</h3>
              <div className="text-sm text-blue-700">
                <p>Username: "{formData.username}"</p>
                <p>User Type: "{formData.userType}"</p>
                <p>Bio: "{formData.bio}"</p>
                <p>Profile exists: {profile ? 'Yes' : 'No'}</p>
                <p>Is Editing: {isEditing ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-10 border border-blue-200">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 text-white text-xl">
                    👤
                  </span>
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={formData.username || ''}
                      onChange={(e) => {
                        console.log('Username input changed:', e.target.value);
                        handleInputChange('username', e.target.value);
                      }}
                      placeholder="Your username"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      I am a: *
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'builder', label: 'Builder', icon: '🔨' },
                        { value: 'ideas', label: 'Ideas', icon: '💡' },
                        { value: 'both', label: 'Both', icon: '🚀' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-4 cursor-pointer p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all transform hover:scale-105">
                          <input
                            type="radio"
                            name="userType"
                            value={option.value}
                            checked={formData.userType === option.value}
                            onChange={(e) => {
                              console.log('User type changed:', e.target.value);
                              handleInputChange('userType', e.target.value as 'builder' | 'ideas' | 'both');
                            }}
                            className="h-5 w-5 text-blue-600 focus:ring-4 focus:ring-blue-500/20 border-2 border-gray-300"
                          />
                          <span className="text-2xl">{option.icon}</span>
                          <span className="text-gray-700 font-bold text-lg">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Story Card */}
              <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-10 border border-purple-200">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 text-white text-xl">
                    📖
                  </span>
                  Your Story
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => {
                        console.log('Bio textarea changed:', e.target.value);
                        handleInputChange('bio', e.target.value);
                      }}
                      placeholder="Tell us about yourself in a few sentences..."
                      rows={3}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-vertical transition-all text-lg font-medium bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience
                      </label>
                      <textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="What's your background and experience?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="passions" className="block text-sm font-semibold text-gray-700 mb-2">
                        Passions
                      </label>
                      <textarea
                        id="passions"
                        value={formData.passions}
                        onChange={(e) => handleInputChange('passions', e.target.value)}
                        placeholder="What are you passionate about?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="values" className="block text-sm font-semibold text-gray-700 mb-2">
                        Values
                      </label>
                      <textarea
                        id="values"
                        value={formData.values}
                        onChange={(e) => handleInputChange('values', e.target.value)}
                        placeholder="What values are important to you?"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="contributionGoals" className="block text-sm font-semibold text-gray-700 mb-2">
                        What are you looking to contribute to?
                      </label>
                      <textarea
                        id="contributionGoals"
                        value={formData.contributionGoals}
                        onChange={(e) => handleInputChange('contributionGoals', e.target.value)}
                        placeholder="What type of projects or causes do you want to contribute to?"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    🛠️
                  </span>
                  Skills & Expertise
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
                    'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
                    'UX Design', 'UI Design', 'CX Design', 'Graphic Design',
                    'Frontend Development', 'Backend Development', 'Full Stack',
                    'Mobile Development', 'DevOps', 'Cloud Computing',
                    'Data Science', 'Machine Learning', 'AI', 'Blockchain',
                    'Product Management', 'Project Management', 'Marketing',
                    'Content Creation', 'Video Production', 'Photography',
                    'Writing', 'Editing', 'Research', 'Strategy'
                  ].map((skill) => (
                    <label key={skill} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={getSkillsArray(formData.skills).includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 font-medium">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                    🔗
                  </span>
                  Social Links & Portfolio
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="portfolioUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      Personal Website
                    </label>
                    <input
                      type="url"
                      id="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="twitterUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      id="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagramUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      id="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    🎯
                  </span>
                  Project Details
                </h2>
                
                <div>
                  <label htmlFor="projectDetails" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tell us about your project or what you're looking for
                  </label>
                  <textarea
                    id="projectDetails"
                    value={formData.projectDetails}
                    onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                    placeholder="Describe your idea, what you're looking to build, or what type of projects you're interested in working on..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-teal-500 text-white py-6 px-10 rounded-2xl hover:from-orange-600 hover:via-red-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:ring-offset-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-xl shadow-2xl transform hover:scale-105"
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-10 py-6 border-3 border-gray-300 text-gray-700 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all font-bold text-xl transform hover:scale-105"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                      {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{profile?.username || 'User'}</h2>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {profile?.userType === 'builder' ? '🔨 Builder' : 
                       profile?.userType === 'ideas' ? '💡 Ideas' : '🚀 Both'}
                    </div>
                  </div>

                  {profile?.bio && (
                    <div className="mb-6">
                      <p className="text-gray-600 text-center italic">"{profile.bio}"</p>
                    </div>
                  )}

                  {getSkillsArray(profile?.skills || '').length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {getSkillsArray(profile?.skills || '').slice(0, 6).map((skill) => (
                          <span key={skill} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {getSkillsArray(profile?.skills || '').length > 6 && (
                          <span className="text-gray-500 text-xs">+{getSkillsArray(profile?.skills || '').length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl || profile?.twitterUrl || profile?.instagramUrl || profile?.websiteUrl) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Connect</h3>
                      <div className="space-y-2">
                                                 {profile.linkedinUrl && (
                           <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                             <span className="mr-2">🔗</span> LinkedIn
                           </a>
                         )}
                         {profile.githubUrl && (
                           <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                             <span className="mr-2">🐙</span> GitHub
                           </a>
                         )}
                         {profile.portfolioUrl && (
                           <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
                             <span className="mr-2">🎨</span> Portfolio
                           </a>
                         )}
                         {profile.websiteUrl && (
                           <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-green-600 hover:text-green-800 transition-colors">
                             <span className="mr-2">🌐</span> Website
                           </a>
                         )}
                         {profile.twitterUrl && (
                           <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-600 transition-colors">
                             <span className="mr-2">🐦</span> Twitter/X
                           </a>
                         )}
                         {profile.instagramUrl && (
                           <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:text-pink-800 transition-colors">
                             <span className="mr-2">📷</span> Instagram
                           </a>
                         )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details Cards */}
              <div className="lg:col-span-2 space-y-8">
                {profile?.experience && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">💼</span>
                      Experience
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.experience}</p>
                  </div>
                )}

                {profile?.passions && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">🔥</span>
                      Passions
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.passions}</p>
                  </div>
                )}

                {profile?.values && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">💎</span>
                      Values
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.values}</p>
                  </div>
                )}

                {profile?.contributionGoals && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">🎯</span>
                      Looking to Contribute To
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.contributionGoals}</p>
                  </div>
                )}

                {profile?.projectDetails && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-3">🚀</span>
                      Project Details
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.projectDetails}</p>
                  </div>
                )}

                {getSkillsArray(profile?.skills || '').length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center mr-3">🛠️</span>
                      All Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {getSkillsArray(profile?.skills || '').map((skill) => (
                        <span key={skill} className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage; 
import React, { useState, useEffect } from 'react';
import { useUserProfile } from './hooks/useUserProfile';
import { CompleteUserProfile, getProfileField, validateProfileData } from './utils/profileUtils';
import { useAuthenticator } from '@aws-amplify/ui-react';

const MyAccountPage: React.FC = () => {
  const { profile, isLoading, error, updateProfile, refreshProfile } = useUserProfile();
  const { signOut } = useAuthenticator();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingProfile, setIsViewingProfile] = useState(false);
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

  // Update form data when profile loads
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

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  // Refresh profile data when component mounts (only once)
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

    // Validate profile data
    const validation = validateProfileData(formData);
    if (!validation.isValid) {
      setMessage('Validation errors: ' + validation.errors.join(', '));
      setIsSaving(false);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      
      // Prepare the data to update
      const updateData = {
        username: formData.username.trim(),
        userType: formData.userType,
        bio: formData.bio?.trim() || '',
        experience: formData.experience?.trim() || '',
        passions: formData.passions?.trim() || '',
        values: formData.values?.trim() || '',
        contributionGoals: formData.contributionGoals?.trim() || '',
        skills: formData.skills?.trim() || '',
        location: formData.location?.trim() || '',
        linkedinUrl: formData.linkedinUrl?.trim() || '',
        githubUrl: formData.githubUrl?.trim() || '',
        portfolioUrl: formData.portfolioUrl?.trim() || '',
        twitterUrl: formData.twitterUrl?.trim() || '',
        instagramUrl: formData.instagramUrl?.trim() || '',
        websiteUrl: formData.websiteUrl?.trim() || '',
        projectDetails: formData.projectDetails?.trim() || ''
      };

      const updatedProfile = await updateProfile(updateData);
      
      console.log('Profile updated successfully:', updatedProfile);
      setMessage('Profile saved successfully!');
      setIsEditing(false);
      
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
    // Username validation
    if (field === 'username') {
      // Only allow alphanumeric characters, underscores, and hyphens
      const usernameRegex = /^[a-zA-Z0-9_-]*$/;
      if (!usernameRegex.test(value)) {
        return; // Don't update if invalid characters
      }
      // Limit length to 3-20 characters
      if (value.length > 20) {
        return;
      }
    }
    
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
    setIsViewingProfile(false); // Exit viewing mode
    setMessage('');
    
    // Initialize form data with current profile data when starting to edit
    if (profile) {
      console.log('Initializing form data for editing:', profile);
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
    } else {
      // Initialize empty form data for new users
      console.log('Initializing empty form data for new user');
      setFormData({
        username: '',
        userType: 'both',
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
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsViewingProfile(false); // Return to overview
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
              <p className="text-gray-600 mb-6">Please wait while we load your profile...</p>
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">If your profile doesn't load within a minute, try refreshing:</p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-teal-600 transition-all font-medium"
                >
                  Refresh Page
                </button>
              </div>
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
      <div className="my-account-page">
        <div className="container">
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">
                Welcome to <span className="gradient-text">Sandhill</span>!
              </h1>
              <p className="hero-subtitle">
                Let's build something amazing together
              </p>
            </div>
          </section>

          <section className="section">
            <div className="content-card">
                              <div className="section-header">
                  <h2 className="section-title">Set Up Your Profile</h2>
                </div>
              <div className="content-block">
                <p>
                  Set up your professional profile to connect with the right people and opportunities. 
                  Share as much information as you feel comfortable with - every detail helps us match you better.
                </p>
                <p className="gradient-text" style={{fontWeight: '600', fontStyle: 'italic'}}>
                  <strong>Your privacy is sacred:</strong> We'll never sell your data. 
                  This platform exists to help you build cool shit, not exploit your information.
                </p>
              </div>
              <div className="cta-buttons">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-large"
                >
                  Set Up Your Profile
                </button>
              </div>
            </div>
          </section>
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
              Hello, <span className="gradient-text">{profile?.username || 'Expert'}</span>!
            </h1>
            <p className="hero-subtitle">
              Welcome to your professional profile on Sandhill
            </p>
            <div className="mt-6">
              <button
                onClick={async () => {
                  try {
                    console.log('MyAccountPage: Sign out initiated...');
                    await signOut();
                    console.log('MyAccountPage: Sign out successful');
                  } catch (error) {
                    console.error('MyAccountPage: Error signing out:', error);
                  }
                }}
                className="btn btn-outline"
                style={{ 
                  cursor: 'pointer',
                  padding: '12px 24px',
                  border: '2px solid var(--primary-orange)',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: 'var(--primary-orange)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {/* Profile Completion Section - Show at top when 100% */}
        {(() => {
          const fields = [
            profile?.username, profile?.bio, profile?.experience, 
            profile?.passions, profile?.values, profile?.skills
          ];
          // Add conditional fields based on user type
          if (profile?.userType === 'expert' || profile?.userType === 'both') {
            fields.push(profile?.contributionGoals);
          }
          if (profile?.userType === 'ventures' || profile?.userType === 'both') {
            fields.push(profile?.projectDetails);
          }
          
          const filledFields = fields.filter(field => field && field.trim() !== '').length;
          const percentage = Math.round((filledFields / fields.length) * 100);
          
          if (percentage === 100) {
            return (
              <section className="section">
                <div className="content-card">
                  <div className="section-header">
                    <h2 className="section-title">Your Profile</h2>
                  </div>
                  <div className="content-block">
                    <p>
                      Your profile is complete! You're all set to connect with the right people and opportunities.
                    </p>
                    
                    {/* Profile Completion Indicator */}
                    <div className="feature-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Profile Completion</span>
                        <span className="text-xs font-bold gradient-text">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            background: 'var(--primary-gradient)',
                            width: `${percentage}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }
          return null;
        })()}

        {/* Main Profile Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <h2 className="section-title">Your Profile</h2>
            </div>
            <div className="content-block">
              <p>
                We encourage you to fill out your profile with as much information as you feel comfortable sharing. 
                The more details you provide, the better we can connect you with the right people and opportunities.
              </p>
              
              {/* Profile Completion Indicator - Smaller version */}
              <div className="feature-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Profile Completion</span>
                  <span className="text-xs font-bold gradient-text">
                    {(() => {
                      const fields = [
                        profile?.username, profile?.bio, profile?.experience, 
                        profile?.passions, profile?.values, profile?.skills
                      ];
                      // Add conditional fields based on user type
                      if (profile?.userType === 'expert' || profile?.userType === 'both') {
                        fields.push(profile?.contributionGoals);
                      }
                      if (profile?.userType === 'ventures' || profile?.userType === 'both') {
                        fields.push(profile?.projectDetails);
                      }
                      
                      const filledFields = fields.filter(field => field && field.trim() !== '').length;
                      const percentage = Math.round((filledFields / fields.length) * 100);
                      return `${percentage}%`;
                    })()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      background: 'var(--primary-gradient)',
                      width: `${(() => {
                        const fields = [
                          profile?.username, profile?.bio, profile?.experience, 
                          profile?.passions, profile?.values, profile?.skills
                        ];
                        // Add conditional fields based on user type
                        if (profile?.userType === 'expert' || profile?.userType === 'both') {
                          fields.push(profile?.contributionGoals);
                        }
                        if (profile?.userType === 'ventures' || profile?.userType === 'both') {
                          fields.push(profile?.projectDetails);
                        }
                        
                        const filledFields = fields.filter(field => field && field.trim() !== '').length;
                        return Math.round((filledFields / fields.length) * 100);
                      })()}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <div className="cta-buttons">
                {!isViewingProfile ? (
                  <>
                    <button
                      onClick={() => setIsViewingProfile(true)}
                      className="btn btn-primary btn-large"
                    >
                      View My Profile
                    </button>
                    <button
                      onClick={handleEdit}
                      className="btn btn-outline btn-large"
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsViewingProfile(false)}
                      className="btn btn-outline btn-large"
                    >
                      Back to Overview
                    </button>
                    <button
                      onClick={handleEdit}
                      className="btn btn-primary btn-large"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Success/Error Messages */}
        {message && (
          <section className="section">
            <div className={`content-card ${
              message.includes('Error') 
                ? 'border-red-200 bg-red-50' 
                : 'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center">
                <span className="font-medium">{message}</span>
              </div>
            </div>
          </section>
        )}

        {isEditing ? (
          <section className="section">
            <div className="content-card">
              <form onSubmit={handleSubmit}>
                {/* Basic Information Card */}
                <div className="section-header">
                  <h2 className="section-title">Basic Information</h2>
                </div>
                
                <div className="grid-2">
                  <div className="feature-card">
                    <label htmlFor="username" className="block text-sm font-semibold mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={formData.username || ''}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Your username (3-20 characters, letters, numbers, _ or -)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.username && formData.username.length < 3 && (
                        <span className="text-red-500">Username must be at least 3 characters</span>
                      )}
                      {formData.username && formData.username.length >= 3 && (
                        <span className="text-green-500">Username is valid</span>
                      )}
                    </p>
                  </div>

                  <div className="feature-card">
                    <label className="block text-sm font-semibold mb-3">
                      I am a: *
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'expert', label: 'Expert' },
                        { value: 'ventures', label: 'Ventures' },
                        { value: 'both', label: 'Both' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
                          <input
                            type="radio"
                            name="userType"
                            value={option.value}
                            checked={formData.userType === option.value}
                            onChange={(e) => handleInputChange('userType', e.target.value as 'expert' | 'ventures' | 'both')}
                            className="h-5 w-5 text-orange-600 focus:ring-2 focus:ring-orange-500 border-2 border-gray-300"
                          />
                          <span className="text-gray-700 font-bold">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personal Story Card */}
                <div className="section-header">
                  <h2 className="section-title">Your Story</h2>
                </div>
                
                <div className="content-block">
                  <div className="feature-card">
                    <label htmlFor="bio" className="block text-sm font-semibold mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself in a few sentences..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                    />
                  </div>

                  <div className="grid-2">
                    <div className="feature-card">
                      <label htmlFor="experience" className="block text-sm font-semibold mb-2">
                        Experience
                      </label>
                      <textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="What's your background and experience?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>

                    <div className="feature-card">
                      <label htmlFor="passions" className="block text-sm font-semibold mb-2">
                        Passions
                      </label>
                      <textarea
                        id="passions"
                        value={formData.passions}
                        onChange={(e) => handleInputChange('passions', e.target.value)}
                        placeholder="What are you passionate about?"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="feature-card">
                      <label htmlFor="values" className="block text-sm font-semibold mb-2">
                        Values
                      </label>
                      <textarea
                        id="values"
                        value={formData.values}
                        onChange={(e) => handleInputChange('values', e.target.value)}
                        placeholder="What values are important to you?"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                      />
                    </div>

                    {(formData.userType === 'expert' || formData.userType === 'both') && (
                      <div className="feature-card">
                        <label htmlFor="contributionGoals" className="block text-sm font-semibold mb-2">
                          What are you looking to contribute to?
                        </label>
                        <textarea
                          id="contributionGoals"
                          value={formData.contributionGoals}
                          onChange={(e) => handleInputChange('contributionGoals', e.target.value)}
                          placeholder="What type of projects or causes do you want to contribute to?"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Card */}
                <div className="section-header">
                  <h2 className="section-title">Skills & Expertise</h2>
                </div>
                
                <div className="feature-card">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-200 hover:bg-orange-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={getSkillsArray(formData.skills).includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="h-3 w-3 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-xs text-gray-700 font-medium">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Card */}
                <div className="section-header">
                  <h2 className="section-title">Location</h2>
                </div>
                
                <div className="feature-card">
                  <label htmlFor="location" className="block text-sm font-semibold mb-2">
                    Your Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., San Francisco, CA or 94102 or Remote"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Share your city/state, zip code, or indicate if you're remote. This helps people connect for local collaboration.
                  </p>
                </div>

                {/* Links & Portfolio Card */}
                <div className="section-header">
                  <h2 className="section-title">Links & Portfolio</h2>
                </div>
                
                <div className="grid-2">
                  <div className="feature-card">
                    <label htmlFor="linkedinUrl" className="block text-sm font-semibold mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="feature-card">
                    <label htmlFor="githubUrl" className="block text-sm font-semibold mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="feature-card">
                    <label htmlFor="portfolioUrl" className="block text-sm font-semibold mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="feature-card">
                    <label htmlFor="websiteUrl" className="block text-sm font-semibold mb-2">
                      Personal Website
                    </label>
                    <input
                      type="url"
                      id="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="feature-card">
                    <label htmlFor="twitterUrl" className="block text-sm font-semibold mb-2">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      id="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="feature-card">
                    <label htmlFor="instagramUrl" className="block text-sm font-semibold mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      id="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Project Details Card - Only for Ventures or Both */}
                {(formData.userType === 'ventures' || formData.userType === 'both') && (
                  <>
                    <div className="section-header">
                      <h2 className="section-title">Project Details</h2>
                    </div>
                    
                    <div className="feature-card">
                      <label htmlFor="projectDetails" className="block text-sm font-semibold mb-2">
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
                  </>
                )}

                {/* Submit Buttons */}
                <div className="cta-buttons">
                  <button
                    type="submit"
                    disabled={isSaving || !formData.username || formData.username.trim().length < 3}
                    className="btn btn-primary btn-large"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline btn-large"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : isViewingProfile ? (
          <section className="section">
            <div className="content-card">
              <div className="section-header">
                <h2 className="section-title">My Profile</h2>
              </div>
              <div className="grid-2">
                {/* Profile Overview Card */}
                <div className="feature-card">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                      {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{profile?.username || 'User'}</h2>
                                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                      {profile?.userType === 'expert' ? 'Expert' : 
                       profile?.userType === 'ventures' ? 'Ventures' : 'Both'}
                    </div>
                    
                    {profile?.location && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          📍 {profile.location}
                        </p>
                      </div>
                    )}
                  </div>

                  {profile?.bio && (
                    <div className="mb-6">
                      <p className="text-gray-600 text-center italic">"{profile.bio}"</p>
                    </div>
                  )}

                  {getSkillsArray(profile?.skills || '').length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {getSkillsArray(profile?.skills || '').slice(0, 6).map((skill) => (
                          <span key={skill} className="bg-gradient-to-r from-orange-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-medium">
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
                      <h3 className="text-sm font-semibold mb-3">Connect</h3>
                      <div className="space-y-2">
                        {profile.linkedinUrl && (
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            LinkedIn
                          </a>
                        )}
                        {profile.githubUrl && (
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                            GitHub
                          </a>
                        )}
                        {profile.portfolioUrl && (
                          <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
                            Portfolio
                          </a>
                        )}
                        {profile.websiteUrl && (
                          <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-green-600 hover:text-green-800 transition-colors">
                            Website
                          </a>
                        )}
                        {profile.twitterUrl && (
                          <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-600 transition-colors">
                            Twitter/X
                          </a>
                        )}
                        {profile.instagramUrl && (
                          <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:text-pink-800 transition-colors">
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Details Cards */}
                <div className="space-y-6">
                  {profile?.experience && (
                    <div className="feature-card">
                      <h3 className="text-xl font-bold mb-4">
                        Experience
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{profile.experience}</p>
                    </div>
                  )}

                  {profile?.passions && (
                    <div className="feature-card">
                      <h3 className="text-xl font-bold mb-4">
                        Passions
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{profile.passions}</p>
                    </div>
                  )}

                  {profile?.values && (
                    <div className="feature-card">
                      <h3 className="text-xl font-bold mb-4">
                        Values
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{profile.values}</p>
                    </div>
                  )}

                  {(profile?.userType === 'expert' || profile?.userType === 'both') && profile?.contributionGoals && (
                    <div className="feature-card">
                      <h3 className="text-xl font-bold mb-4">
                        Looking to Contribute To
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{profile.contributionGoals}</p>
                    </div>
                  )}

                  {(profile?.userType === 'ventures' || profile?.userType === 'both') && profile?.projectDetails && (
                    <div className="feature-card">
                      <h3 className="text-xl font-bold mb-4">
                        Project Details
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{profile.projectDetails}</p>
                    </div>
                  )}

                  {getSkillsArray(profile?.skills || '').length > 0 && (
                    <div className="feature-card">
                      <h3 className="text-xl font-bold mb-4">
                        All Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {getSkillsArray(profile?.skills || '').map((skill) => (
                          <span key={skill} className="bg-gradient-to-r from-teal-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="section">
            <div className="content-card">
              <div className="section-header">
                <h2 className="section-title">Profile Overview</h2>
              </div>
              <div className="content-block">
                <p>
                  Welcome to your profile dashboard! Here you can view your profile completion status and manage your information.
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Quick Stats:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Username: {profile?.username || 'Not set'}</li>
                    <li>• User Type: {profile?.userType === 'expert' ? 'Expert' : profile?.userType === 'ventures' ? 'Ventures' : 'Both'}</li>
                    <li>• Location: {profile?.location || 'Not set'}</li>
                    <li>• Bio: {profile?.bio ? 'Set' : 'Not set'}</li>
                    <li>• Experience: {profile?.experience ? 'Set' : 'Not set'}</li>
                    <li>• Skills: {getSkillsArray(profile?.skills || '').length} selected</li>
                    <li>• Links: {(() => {
                      const links = [profile?.linkedinUrl, profile?.githubUrl, profile?.portfolioUrl, profile?.websiteUrl, profile?.twitterUrl, profile?.instagramUrl];
                      return links.filter(link => link && link.trim() !== '').length;
                    })()} added</li>
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={async () => {
                      try {
                        console.log('MyAccountPage: Sign out initiated...');
                        await signOut();
                        console.log('MyAccountPage: Sign out successful');
                      } catch (error) {
                        console.error('MyAccountPage: Error signing out:', error);
                      }
                    }}
                    className="btn btn-outline"
                    style={{ 
                      cursor: 'pointer',
                      padding: '12px 24px',
                      border: '2px solid var(--primary-orange)',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: 'var(--primary-orange)',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
                
                {/* Debug Info - Only show in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold mb-2 text-blue-800">Debug Info:</h3>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>Profile ID: {profile?.id || 'None'}</p>
                      <p>User ID: {profile?.userId || 'None'}</p>
                      <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
                      <p>Has Error: {error ? 'Yes' : 'No'}</p>
                      {error && <p>Error: {error}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Privacy Statement */}
        <section className="section">
          <div className="content-card">
            <div className="content-block">
              <p className="gradient-text" style={{fontWeight: '600', fontStyle: 'italic'}}>
                <strong>Your privacy matters:</strong> None of your personal details will ever be sold. 
                We're here to help you build cool shit, not exploit your data. 
                This platform exists to enable creators, experts, and innovators like you.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyAccountPage; 
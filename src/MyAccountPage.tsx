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

  // Update form data when profile loads
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setMessage('');

    try {
      if (profile) {
        // Update existing profile
        await updateProfile({
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
      } else {
        // Create new profile
        await refreshProfile();
      }
      setMessage('Profile saved successfully!');
      setIsEditing(false);
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

  const getSkillsArray = (skillsString: string): string[] => {
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
    // Reset form data to current profile
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300">
            <p className="mb-4">{error}</p>
            <div className="flex space-x-4">
              <button
                onClick={handleRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Profile Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Profile Setup Required</h3>
            <p className="text-yellow-700 mb-4">
              We need to set up your profile. This will help you connect with other builders and ideas.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Set Up Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!profile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  Creating your profile... Please fill out the information below.
                </p>
              </div>
            )}
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* User Type Selection */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-700">
              I am a:
            </label>
            <div className="space-y-2">
              {[
                { value: 'builder', label: 'Builder' },
                { value: 'ideas', label: 'Ideas' },
                { value: 'both', label: 'Both' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="userType"
                    value={option.value}
                    checked={formData.userType === option.value}
                    onChange={(e) => handleInputChange('userType', e.target.value as 'builder' | 'ideas' | 'both')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-lg font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="block text-lg font-medium text-gray-700 mb-2">
              Experience
            </label>
            <textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="What's your background and experience?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Passions */}
          <div>
            <label htmlFor="passions" className="block text-lg font-medium text-gray-700 mb-2">
              Passions
            </label>
            <textarea
              id="passions"
              value={formData.passions}
              onChange={(e) => handleInputChange('passions', e.target.value)}
              placeholder="What are you passionate about?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Values */}
          <div>
            <label htmlFor="values" className="block text-lg font-medium text-gray-700 mb-2">
              Values
            </label>
            <textarea
              id="values"
              value={formData.values}
              onChange={(e) => handleInputChange('values', e.target.value)}
              placeholder="What values are important to you?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Contribution Goals */}
          <div>
            <label htmlFor="contributionGoals" className="block text-lg font-medium text-gray-700 mb-2">
              What are you looking to contribute to?
            </label>
            <textarea
              id="contributionGoals"
              value={formData.contributionGoals}
              onChange={(e) => handleInputChange('contributionGoals', e.target.value)}
              placeholder="What type of projects or causes do you want to contribute to?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Skills (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                                 <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                   <input
                     type="checkbox"
                     checked={getSkillsArray(formData.skills).includes(skill)}
                     onChange={() => handleSkillToggle(skill)}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                   />
                   <span className="text-sm text-gray-700">{skill}</span>
                 </label>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  id="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Website
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter/X URL
                </label>
                <input
                  type="url"
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label htmlFor="projectDetails" className="block text-lg font-medium text-gray-700 mb-2">
              Tell us about your project or what you're looking for
            </label>
            <textarea
              id="projectDetails"
              value={formData.projectDetails}
              onChange={(e) => handleInputChange('projectDetails', e.target.value)}
              placeholder="Describe your idea, what you're looking to build, or what type of projects you're interested in working on..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex space-x-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        ) : (
          <div className="space-y-6">
            {/* Profile View */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Username</h3>
                  <p className="text-gray-600">{profile?.username || 'Not set'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">I am a</h3>
                  <p className="text-gray-600 capitalize">{profile?.userType || 'Not set'}</p>
                </div>

                {profile?.bio && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                    <p className="text-gray-600">{profile.bio}</p>
                  </div>
                )}

                {profile?.experience && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                    <p className="text-gray-600">{profile.experience}</p>
                  </div>
                )}

                {profile?.passions && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Passions</h3>
                    <p className="text-gray-600">{profile.passions}</p>
                  </div>
                )}

                {profile?.values && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Values</h3>
                    <p className="text-gray-600">{profile.values}</p>
                  </div>
                )}

                {profile?.contributionGoals && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">What I'm looking to contribute to</h3>
                    <p className="text-gray-600">{profile.contributionGoals}</p>
                  </div>
                )}

                {profile?.skills && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {getSkillsArray(profile.skills).map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl || profile?.twitterUrl || profile?.instagramUrl || profile?.websiteUrl) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                    <div className="space-y-2">
                      {profile.linkedinUrl && (
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 block">
                          LinkedIn
                        </a>
                      )}
                      {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 block">
                          GitHub
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 block">
                          Portfolio
                        </a>
                      )}
                      {profile.websiteUrl && (
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 block">
                          Personal Website
                        </a>
                      )}
                      {profile.twitterUrl && (
                        <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 block">
                          Twitter/X
                        </a>
                      )}
                      {profile.instagramUrl && (
                        <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 block">
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {profile?.projectDetails && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
                    <p className="text-gray-600">{profile.projectDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage; 
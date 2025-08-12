// ExpertsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { 
  ListUserProfilesQuery, 
  UserProfileUserType
} from '../API';
import { listUserProfiles } from '../queries';
import { formatTimezone, getTimeInTimezone, isRemoteLocation } from './utils/locationUtils';
import { getMissionValueNames } from './data/missionValues';
import { getVentureInterestNames } from './data/ventureInterests';
import { getEngagementTypeNames } from './data/engagementTypes';

interface ExpertProfile {
  id: string;
  username: string;
  userType: UserProfileUserType;
  bio: string;
  experience: string;
  skills: string;
  location: string;
  timezone: string;
  values: string;
  missionValuesAlignment: string;
  ventureInterests: string;
  preferredEngagement: string;
  timeCommitment: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

const ExpertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<ExpertProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Load experts on component mount
  useEffect(() => {
    loadExperts();
  }, []);

  // Filter experts when search term or filters change
  useEffect(() => {
    filterExperts();
  }, [searchTerm, selectedSkills, selectedValues, experts]);

  const loadExperts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = generateClient();
      
      // Query for experts and both user types
      const result = await client.graphql({
        query: listUserProfiles,
        variables: {
          filter: {
            or: [
              { userType: { eq: UserProfileUserType.expert } },
              { userType: { eq: UserProfileUserType.both } }
            ]
          }
        }
      });

      const profiles = result.data?.listUserProfiles?.items || [];
      
      // Convert to ExpertProfile format
      const expertProfiles: ExpertProfile[] = profiles.map((profile: any) => ({
        id: profile.id,
        username: profile.username || '',
        userType: profile.userType || UserProfileUserType.expert,
        bio: profile.bio || '',
        experience: profile.experience || '',
        skills: profile.skills || '',
        location: profile.location || '',
        timezone: profile.timezone || '',
        values: profile.values || '',
        missionValuesAlignment: profile.missionValuesAlignment || '',
        ventureInterests: profile.ventureInterests || '',
        preferredEngagement: profile.preferredEngagement || '',
        timeCommitment: profile.timeCommitment || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        websiteUrl: profile.websiteUrl || '',
        twitterUrl: profile.twitterUrl || '',
        instagramUrl: profile.instagramUrl || ''
      }));

      setExperts(expertProfiles);
      setFilteredExperts(expertProfiles);
    } catch (err) {
      console.error('Error loading experts:', err);
      setError('Failed to load experts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterExperts = () => {
    let filtered = experts;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(expert => 
        expert.username.toLowerCase().includes(searchLower) ||
        expert.bio.toLowerCase().includes(searchLower) ||
        expert.experience.toLowerCase().includes(searchLower) ||
        expert.skills.toLowerCase().includes(searchLower) ||
        expert.values.toLowerCase().includes(searchLower) ||
        expert.missionValuesAlignment.toLowerCase().includes(searchLower) ||
        expert.ventureInterests.toLowerCase().includes(searchLower) ||
        expert.preferredEngagement.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(expert => 
        selectedSkills.some(skill => 
          expert.skills.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    // Filter by selected values
    if (selectedValues.length > 0) {
      filtered = filtered.filter(expert => 
        selectedValues.some(value => 
          expert.missionValuesAlignment.toLowerCase().includes(value.toLowerCase()) ||
          expert.values.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    setFilteredExperts(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSkillFilter = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleValueFilter = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setSelectedValues([]);
  };

  const handleViewProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const getUserTypeDisplay = (userType: UserProfileUserType) => {
    switch (userType) {
      case UserProfileUserType.expert:
        return 'Expert';
      case UserProfileUserType.both:
        return 'Expert & Venture';
      default:
        return 'User';
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/login?signup=true');
  };

  // Popular skills for filtering
  const popularSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 
    'UX/UI', 'Product Design', 'Marketing', 'Business Development',
    'Data Science', 'Machine Learning', 'Mobile Development', 'DevOps'
  ];

  // Popular values for filtering
  const popularValues = [
    'Social Impact', 'Sustainability', 'Innovation', 'Community',
    'Education', 'Healthcare', 'Fintech', 'AI/ML', 'Clean Energy'
  ];

  return (
    <div className="experts-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Meet Amazing<br />
              <span className="gradient-text">Experts</span>
            </h1>
            <p className="hero-subtitle">
              Connect with skilled professionals who are passionate about making a difference and building meaningful projects.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={handleSignUp}>
                Post Your Idea
              </button>
            </div>
            <div className="scroll-indicator float">
              <span className="scroll-text">Scroll to explore</span>
              <div className="scroll-arrow">↓</div>
            </div>
          </div>
        </section>

        {/* Search and Filters Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header-left">
              <div className="eyebrow">Find Experts</div>
              <h2 className="section-title">
                Search and discover experts with the skills and values you need
              </h2>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, skills, experience, values, or keywords..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Skills:</span>
                  {popularSkills.slice(0, 8).map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleSkillFilter(skill)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedSkills.includes(skill)
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Values:</span>
                  {popularValues.slice(0, 6).map(value => (
                    <button
                      key={value}
                      onClick={() => handleValueFilter(value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedValues.includes(value)
                          ? 'bg-teal-100 text-teal-800 border border-teal-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedSkills.length > 0 || selectedValues.length > 0 || searchTerm) && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Active filters:</span>
                  {selectedSkills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                      {skill} ×
                    </span>
                  ))}
                  {selectedValues.map(value => (
                    <span key={value} className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-sm">
                      {value} ×
                    </span>
                  ))}
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      "{searchTerm}" ×
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {isLoading ? 'Loading experts...' : 
                 `Found ${filteredExperts.length} expert${filteredExperts.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
        </section>

        {/* Experts Grid */}
        <section className="section">
          <div className="content-card">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Experts</h3>
                <p className="text-gray-600">Finding amazing professionals...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Experts</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadExperts}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : filteredExperts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Experts Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find more experts.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperts.map((expert) => (
                  <div key={expert.id} className="expert-card">
                    <div className="expert-card-header">
                      <div className="expert-avatar">
                        {expert.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="expert-info">
                        <h3 className="expert-name">{expert.username}</h3>
                        <span className="expert-type">{getUserTypeDisplay(expert.userType)}</span>
                      </div>
                    </div>
                    
                    <div className="expert-bio">
                      {expert.bio ? (
                        <p className="text-gray-700 line-clamp-3">{expert.bio}</p>
                      ) : (
                        <p className="text-gray-500 italic">No bio provided yet.</p>
                      )}
                    </div>

                    {expert.skills && (
                      <div className="expert-skills">
                        <h4 className="expert-section-title">Skills</h4>
                        <div className="skills-tags">
                          {expert.skills.split(',').slice(0, 3).map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                          {expert.skills.split(',').length > 3 && (
                            <span className="skill-tag-more">
                              +{expert.skills.split(',').length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {expert.missionValuesAlignment && (
                      <div className="expert-values">
                        <h4 className="expert-section-title">Values</h4>
                        <div className="values-tags">
                          {expert.missionValuesAlignment.split(',').slice(0, 2).map((value, index) => (
                            <span key={index} className="value-tag">
                              {value.trim()}
                            </span>
                          ))}
                          {expert.missionValuesAlignment.split(',').length > 2 && (
                            <span className="value-tag-more">
                              +{expert.missionValuesAlignment.split(',').length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="expert-meta">
                      {expert.location && (
                        <div className="expert-location">
                          📍 {expert.location}
                          {expert.timezone && !isRemoteLocation(expert.location) && (
                            <span className="text-sm text-gray-500 ml-2">
                              • {formatTimezone(expert.timezone)}
                            </span>
                          )}
                        </div>
                      )}
                      {expert.timeCommitment && (
                        <div className="expert-commitment">
                          ⏰ {expert.timeCommitment}
                        </div>
                      )}
                    </div>

                    <div className="expert-actions">
                      <button
                        onClick={() => handleViewProfile(expert.username)}
                        className="btn btn-primary btn-full"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section fade-in">
          <div className="section-header">
            <h2 className="section-title">Ready to find your team?</h2>
          </div>
          <p className="cta-text">
            Post your idea and connect with experts who share your vision and values.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={handleSignUp}>
              Sign Up
            </button>
            <button className="btn btn-outline btn-large" onClick={handleNavigateToLogin}>
              Log In
            </button>
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">{experts.length}+</span>
              <span className="trust-label">Experts available</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">50+</span>
              <span className="trust-label">Skills categories</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">95%</span>
              <span className="trust-label">Response rate</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExpertsPage; 
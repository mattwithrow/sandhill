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

        {/* Main Content - Sidebar Layout */}
        <section className="section">
          <div className="experts-layout">
            {/* Left Sidebar - Search and Filters */}
            <div className="experts-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Find Experts</h3>
                
                {/* Search Bar */}
                <div className="search-section">
                  <label className="search-label">Search</label>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search by name, skills, experience..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="search-input"
                    />
                    <div className="search-icon">🔍</div>
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Skills</h4>
                  <div className="filter-tags">
                    {popularSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleSkillFilter(skill)}
                        className={`filter-tag ${
                          selectedSkills.includes(skill) ? 'filter-tag-active' : ''
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Values Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Values & Mission</h4>
                  <div className="filter-tags">
                    {popularValues.map(value => (
                      <button
                        key={value}
                        onClick={() => handleValueFilter(value)}
                        className={`filter-tag ${
                          selectedValues.includes(value) ? 'filter-tag-active' : ''
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedSkills.length > 0 || selectedValues.length > 0 || searchTerm) && (
                  <div className="active-filters">
                    <h4 className="filter-title">Active Filters</h4>
                    <div className="active-filter-tags">
                      {selectedSkills.map(skill => (
                        <span key={skill} className="active-filter-tag skill-filter">
                          {skill} ×
                        </span>
                      ))}
                      {selectedValues.map(value => (
                        <span key={value} className="active-filter-tag value-filter">
                          {value} ×
                        </span>
                      ))}
                      {searchTerm && (
                        <span className="active-filter-tag search-filter">
                          "{searchTerm}" ×
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="clear-filters-btn"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {/* Results Count */}
                <div className="results-count">
                  <p className="results-text">
                    {isLoading ? 'Loading experts...' : 
                     `${filteredExperts.length} expert${filteredExperts.length !== 1 ? 's' : ''} found`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Expert Listings */}
            <div className="experts-content">
              {isLoading ? (
                <div className="loading-state">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <h3 className="loading-title">Loading Experts</h3>
                  <p className="loading-text">Finding amazing professionals...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <div className="error-icon">⚠️</div>
                  <h3 className="error-title">Error Loading Experts</h3>
                  <p className="error-text">{error}</p>
                  <button
                    onClick={loadExperts}
                    className="btn btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredExperts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3 className="empty-title">No Experts Found</h3>
                  <p className="empty-text">
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
                <div className="experts-list">
                  {filteredExperts.map((expert) => (
                    <div key={expert.id} className="expert-list-item">
                      <div className="expert-list-avatar">
                        {expert.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="expert-list-content">
                        <div className="expert-list-header">
                          <h3 className="expert-list-name">{expert.username}</h3>
                          <span className="expert-list-type">{getUserTypeDisplay(expert.userType)}</span>
                        </div>
                        
                        <div className="expert-list-bio">
                          {expert.bio ? (
                            <p className="expert-bio-text">{expert.bio}</p>
                          ) : (
                            <p className="expert-bio-placeholder">No bio provided yet.</p>
                          )}
                        </div>

                        <div className="expert-list-details">
                          {expert.skills && (
                            <div className="expert-list-skills">
                              <span className="expert-list-label">Skills:</span>
                              <div className="expert-list-tags">
                                {expert.skills.split(',').slice(0, 3).map((skill, index) => (
                                  <span key={index} className="expert-list-tag skill-tag">
                                    {skill.trim()}
                                  </span>
                                ))}
                                {expert.skills.split(',').length > 3 && (
                                  <span className="expert-list-tag-more">
                                    +{expert.skills.split(',').length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {expert.missionValuesAlignment && (
                            <div className="expert-list-values">
                              <span className="expert-list-label">Values:</span>
                              <div className="expert-list-tags">
                                {expert.missionValuesAlignment.split(',').slice(0, 2).map((value, index) => (
                                  <span key={index} className="expert-list-tag value-tag">
                                    {value.trim()}
                                  </span>
                                ))}
                                {expert.missionValuesAlignment.split(',').length > 2 && (
                                  <span className="expert-list-tag-more">
                                    +{expert.missionValuesAlignment.split(',').length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="expert-list-meta">
                          {expert.location && (
                            <div className="expert-list-location">
                              📍 {expert.location}
                              {expert.timezone && !isRemoteLocation(expert.location) && (
                                <span className="expert-list-timezone">
                                  • {formatTimezone(expert.timezone)}
                                </span>
                              )}
                            </div>
                          )}
                          {expert.timeCommitment && (
                            <div className="expert-list-commitment">
                              ⏰ {expert.timeCommitment}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="expert-list-actions">
                        <button
                          onClick={() => handleViewProfile(expert.username)}
                          className="btn btn-primary"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
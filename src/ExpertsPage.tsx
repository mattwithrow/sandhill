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
  ventureInterestsDescription: string;
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
  const [expandedSkills, setExpandedSkills] = useState(false);
  const [expandedValues, setExpandedValues] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [distanceRadius, setDistanceRadius] = useState(50);
  const [usOnly, setUsOnly] = useState(false);
  const [includeRemote, setIncludeRemote] = useState(true);
  
  // Mobile filter state
  const [isMobileFilterExpanded, setIsMobileFilterExpanded] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Load experts on component mount
  useEffect(() => {
    loadExperts();
  }, []);

  // Filter experts when search term or filters change
  useEffect(() => {
    filterExperts();
  }, [searchTerm, selectedSkills, selectedValues, locationFilter, distanceRadius, usOnly, includeRemote, experts]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSkills, selectedValues, locationFilter, distanceRadius, usOnly, includeRemote]);

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
        ventureInterestsDescription: profile.ventureInterestsDescription || '',
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
        expert.ventureInterestsDescription.toLowerCase().includes(searchLower) ||
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

    // Filter by location
    if (locationFilter.trim()) {
      const locationLower = locationFilter.toLowerCase();
      filtered = filtered.filter(expert => {
        if (!expert.location) return false;
        
        const expertLocation = expert.location.toLowerCase();
        
        // Always include remote workers if option is checked
        if (includeRemote && isRemoteLocation(expert.location)) {
          return true;
        }
        
        // Check if location matches the search term
        return expertLocation.includes(locationLower);
      });
    }

    // Filter by US only
    if (usOnly) {
      filtered = filtered.filter(expert => {
        if (!expert.location) return false;
        
        // Include remote workers if option is checked
        if (includeRemote && isRemoteLocation(expert.location)) {
          return true;
        }
        
        // Simple US location check (can be enhanced with proper geocoding)
        const usLocations = [
          'united states', 'usa', 'us', 'california', 'new york', 'texas', 'florida',
          'illinois', 'pennsylvania', 'ohio', 'georgia', 'north carolina', 'michigan',
          'new jersey', 'virginia', 'washington', 'arizona', 'massachusetts', 'tennessee',
          'indiana', 'missouri', 'maryland', 'colorado', 'wisconsin', 'minnesota',
          'south carolina', 'alabama', 'louisiana', 'kentucky', 'oregon', 'oklahoma',
          'connecticut', 'utah', 'iowa', 'nevada', 'arkansas', 'mississippi', 'kansas',
          'new mexico', 'nebraska', 'idaho', 'west virginia', 'hawaii', 'new hampshire',
          'maine', 'montana', 'rhode island', 'delaware', 'south dakota', 'north dakota',
          'alaska', 'vermont', 'wyoming'
        ];
        
        return usLocations.some(usLocation => 
          expert.location.toLowerCase().includes(usLocation)
        );
      });
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
    setLocationFilter('');
    setDistanceRadius(50);
    setUsOnly(false);
    setIncludeRemote(true);
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

  // Pagination functions
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = filteredExperts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
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

  // Get visible skills (first 5 + selected ones)
  const visibleSkills = expandedSkills 
    ? popularSkills 
    : [...new Set([...popularSkills.slice(0, 5), ...selectedSkills])];

  // Get visible values (first 5 + selected ones)
  const visibleValues = expandedValues 
    ? popularValues 
    : [...new Set([...popularValues.slice(0, 5), ...selectedValues])];

  return (
    <div className="experts-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero hero-compact">
          <div className="hero-content">
            <h1 className="hero-title">
              Meet Amazing<br />
              <span className="gradient-text">Experts</span>
            </h1>
            <p className="hero-subtitle">
              Connect with skilled professionals who are passionate about making a difference and building meaningful projects.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <div className="eyebrow">How It Works</div>
              <h2 className="section-title">
                Find the perfect expert for your project
              </h2>
            </div>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Send a Quick Intro</h3>
                  <p className="step-description">
                    Share a little about your idea, your mission, and the type of support you're looking for.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">Explore Mutual Fit</h3>
                  <p className="step-description">
                    Ask questions and see if your goals and values align.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">Schedule a Chat</h3>
                  <p className="step-description">
                    A short call, coffee, or virtual meeting can help you both understand how to work together.
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3 className="step-title">Collaborate and Build</h3>
                  <p className="step-description">
                    Begin working with your chosen expert to turn your idea into reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Sidebar Layout */}
        <section className="section">
          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-toggle">
            <button
              onClick={() => setIsMobileFilterExpanded(!isMobileFilterExpanded)}
              className="mobile-filter-btn"
            >
              <span className="mobile-filter-icon">🔍</span>
              <span className="mobile-filter-text">
                {isMobileFilterExpanded ? 'Hide Filters' : 'Show Filters'}
              </span>
              <span className={`mobile-filter-arrow ${isMobileFilterExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          <div className="experts-layout">
            {/* Left Sidebar - Search and Filters */}
            <div className={`experts-sidebar ${isMobileFilterExpanded ? 'mobile-expanded' : ''}`}>
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <h3 className="sidebar-title">Find Experts</h3>
                  <button
                    onClick={() => setIsMobileFilterExpanded(false)}
                    className="mobile-filter-close"
                  >
                    ✕
                  </button>
                </div>
                
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

                {/* Location Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Location</h4>
                  <div className="location-input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter zip code or city..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="location-input"
                    />
                    <div className="location-icon">📍</div>
                  </div>
                  
                  <div className="distance-filter">
                    <label className="distance-label">Within {distanceRadius} miles</label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={distanceRadius}
                      onChange={(e) => setDistanceRadius(parseInt(e.target.value))}
                      className="distance-slider"
                    />
                    <div className="distance-values">
                      <span>10</span>
                      <span>250</span>
                      <span>500</span>
                    </div>
                  </div>
                  
                  <div className="location-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={usOnly}
                        onChange={(e) => setUsOnly(e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">US only</span>
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={includeRemote}
                        onChange={(e) => setIncludeRemote(e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Include remote workers</span>
                    </label>
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Skills</h4>
                  <div className="filter-tags">
                    {visibleSkills.map(skill => (
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
                  {popularSkills.length > 5 && (
                    <button
                      onClick={() => setExpandedSkills(!expandedSkills)}
                      className="expand-collapse-btn"
                    >
                      {expandedSkills ? 'Show Less' : `Show ${popularSkills.length - 5} More`}
                    </button>
                  )}
                </div>

                {/* Values Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Values & Mission</h4>
                  <div className="filter-tags">
                    {visibleValues.map(value => (
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
                  {popularValues.length > 5 && (
                    <button
                      onClick={() => setExpandedValues(!expandedValues)}
                      className="expand-collapse-btn"
                    >
                      {expandedValues ? 'Show Less' : `Show ${popularValues.length - 5} More`}
                    </button>
                  )}
                </div>

                {/* Active Filters */}
                {(selectedSkills.length > 0 || selectedValues.length > 0 || searchTerm || locationFilter || usOnly) && (
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
                      {locationFilter && (
                        <span className="active-filter-tag location-filter">
                          📍 {locationFilter} ({distanceRadius}mi) ×
                        </span>
                      )}
                      {usOnly && (
                        <span className="active-filter-tag location-filter">
                          🇺🇸 US only ×
                        </span>
                      )}
                      {!includeRemote && (
                        <span className="active-filter-tag location-filter">
                          🚫 No remote ×
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
                <>
                  <div className="experts-list">
                    {currentExperts.map((expert) => (
                      <div key={expert.id} className="expert-list-item">
                        <div className="expert-list-content">
                          <div className="expert-list-header">
                            <h3 className="expert-list-name">{expert.username}</h3>
                            <span className="expert-list-type">{getUserTypeDisplay(expert.userType)}</span>
                          </div>
                          
                          <div className="expert-list-bio">
                            {expert.bio ? (
                              <p className="expert-bio-text line-clamp-1">{expert.bio}</p>
                            ) : (
                              <p className="expert-bio-placeholder">No bio provided yet.</p>
                            )}
                          </div>

                          <div className="expert-list-experience">
                            {expert.experience ? (
                              <p className="expert-experience-text line-clamp-1">{expert.experience}</p>
                            ) : (
                              <p className="expert-experience-placeholder">No experience details provided yet.</p>
                            )}
                          </div>

                          {expert.ventureInterestsDescription && (
                            <div className="expert-list-venture-interests">
                              <p className="expert-venture-interests-text line-clamp-1">
                                💡 {expert.ventureInterestsDescription}
                              </p>
                            </div>
                          )}

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

                            {expert.preferredEngagement && (
                              <div className="expert-list-engagement">
                                <span className="expert-list-label">Engagement:</span>
                                <div className="expert-list-tags">
                                  {expert.preferredEngagement.split(',').slice(0, 2).map((engagement, index) => (
                                    <span key={index} className="expert-list-tag engagement-tag">
                                      {engagement.trim()}
                                    </span>
                                  ))}
                                  {expert.preferredEngagement.split(',').length > 2 && (
                                    <span className="expert-list-tag-more">
                                      +{expert.preferredEngagement.split(',').length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {expert.values && (
                              <div className="expert-list-values">
                                <span className="expert-list-label">Values:</span>
                                <div className="expert-list-tags">
                                  {expert.values.split(',').slice(0, 2).map((value, index) => (
                                    <span key={index} className="expert-list-tag value-tag">
                                      {value.trim()}
                                    </span>
                                  ))}
                                  {expert.values.split(',').length > 2 && (
                                    <span className="expert-list-tag-more">
                                      +{expert.values.split(',').length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="expert-list-meta">
                            <div className="expert-list-meta-row">
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
                                  <span className="commitment-pill">
                                    ⏰ {expert.timeCommitment}
                                  </span>
                                </div>
                              )}
                            </div>
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <div className="pagination-info">
                        <span className="pagination-text">
                          Showing {startIndex + 1}-{Math.min(endIndex, filteredExperts.length)} of {filteredExperts.length} experts
                        </span>
                      </div>
                      
                      <div className="pagination-controls">
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                          className="pagination-btn pagination-prev"
                        >
                          ← Previous
                        </button>
                        
                        <div className="pagination-pages">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            // Show first page, last page, current page, and pages around current
                            const shouldShow = 
                              page === 1 || 
                              page === totalPages || 
                              (page >= currentPage - 1 && page <= currentPage + 1);
                            
                            if (!shouldShow) {
                              // Show ellipsis for gaps
                              if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="pagination-ellipsis">...</span>;
                              }
                              return null;
                            }
                            
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`pagination-btn pagination-page ${
                                  page === currentPage ? 'pagination-active' : ''
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="pagination-btn pagination-next"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
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
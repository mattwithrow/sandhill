// VenturesPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { 
  ListUserProfilesQuery, 
  UserProfileUserType
} from '../API';
import { listUserProfiles } from '../queries';
import RecommendationSection from './components/RecommendationSection';

interface VentureProfile {
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
  expertSupportNeeded: string;
  messagingEnabled: boolean | null;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

const VenturesPage: React.FC = () => {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator();
  const isAuthenticated = authStatus === 'authenticated';
  const [ventures, setVentures] = useState<VentureProfile[]>([]);
  const [filteredVentures, setFilteredVentures] = useState<VentureProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedValues, setExpandedValues] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [distanceRadius, setDistanceRadius] = useState(50);
  const [usOnly, setUsOnly] = useState(false);
  const [includeRemote, setIncludeRemote] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Load ventures on component mount
  useEffect(() => {
    loadVentures();
  }, []);

  // Filter ventures when search term or filters change
  useEffect(() => {
    filterVentures();
  }, [searchTerm, selectedCategories, selectedValues, locationFilter, distanceRadius, usOnly, includeRemote, ventures]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedValues, locationFilter, distanceRadius, usOnly, includeRemote]);

  const loadVentures = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = generateClient();
      
      // Query for ventures and both user types
      const result = await client.graphql({
        query: listUserProfiles,
        variables: {
          filter: {
            or: [
              { userType: { eq: UserProfileUserType.ventures } },
              { userType: { eq: UserProfileUserType.both } }
            ]
          }
        }
      });

      const profiles = result.data?.listUserProfiles?.items || [];
      
      // Convert to VentureProfile format and filter out hidden profiles
      const ventureProfiles: VentureProfile[] = profiles
        .filter((profile: any) => !profile.isProfileHidden) // Filter out hidden profiles
        .map((profile: any) => ({
          id: profile.id,
          username: profile.username || '',
          userType: profile.userType || UserProfileUserType.ventures,
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
          expertSupportNeeded: profile.expertSupportNeeded || '',
          messagingEnabled: profile.messagingEnabled,
          linkedinUrl: profile.linkedinUrl || '',
          githubUrl: profile.githubUrl || '',
          portfolioUrl: profile.portfolioUrl || '',
          websiteUrl: profile.websiteUrl || '',
          twitterUrl: profile.twitterUrl || '',
          instagramUrl: profile.instagramUrl || ''
        }));

      setVentures(ventureProfiles);
      setFilteredVentures(ventureProfiles);
    } catch (err) {
      console.error('Error loading ventures:', err);
      setError('Failed to load ventures. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterVentures = () => {
    let filtered = ventures;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(venture => 
        venture.username.toLowerCase().includes(searchLower) ||
        venture.bio.toLowerCase().includes(searchLower) ||
        venture.experience.toLowerCase().includes(searchLower) ||
        venture.expertSupportNeeded.toLowerCase().includes(searchLower) ||
        venture.skills.toLowerCase().includes(searchLower) ||
        venture.missionValuesAlignment.toLowerCase().includes(searchLower) ||
        venture.ventureInterests.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected categories (venture interests)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(venture => 
        selectedCategories.some(category => 
          venture.ventureInterests.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by selected values
    if (selectedValues.length > 0) {
      filtered = filtered.filter(venture => 
        selectedValues.some(value => 
          venture.missionValuesAlignment.toLowerCase().includes(value.toLowerCase()) ||
          venture.values.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    // Filter by location
    if (locationFilter.trim()) {
      const locationLower = locationFilter.toLowerCase();
      filtered = filtered.filter(venture => {
        if (!venture.location) return false;
        
        const ventureLocation = venture.location.toLowerCase();
        
        // Always include remote workers if option is checked
        if (includeRemote && venture.location.toLowerCase().includes('remote')) {
          return true;
        }
        
        // Check if location matches the search term
        return ventureLocation.includes(locationLower);
      });
    }

    // Filter by US only
    if (usOnly) {
      filtered = filtered.filter(venture => {
        if (!venture.location) return false;
        
        // Include remote workers if option is checked
        if (includeRemote && venture.location.toLowerCase().includes('remote')) {
          return true;
        }
        
        // Simple US location check
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
          venture.location.toLowerCase().includes(usLocation)
        );
      });
    }

    setFilteredVentures(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
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
    setSelectedCategories([]);
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
      case UserProfileUserType.ventures:
        return 'Venture';
      case UserProfileUserType.both:
        return 'Venture & Expert';
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
  const totalPages = Math.ceil(filteredVentures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVentures = filteredVentures.slice(startIndex, endIndex);

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

  // Popular venture categories for filtering
  const popularCategories = [
    'Early Stage', 'Social Impact', 'Sustainability', 'Fintech', 
    'Healthcare', 'Education', 'AI/ML', 'Clean Energy', 'E-commerce',
    'Mobile Apps', 'SaaS', 'Marketplace', 'B2B', 'Consumer'
  ];

  // Popular values for filtering
  const popularValues = [
    'Social Impact', 'Sustainability', 'Innovation', 'Community',
    'Education', 'Healthcare', 'Fintech', 'AI/ML', 'Clean Energy'
  ];

  // Get visible categories (first 5 + selected ones)
  const visibleCategories = expandedCategories 
    ? popularCategories 
    : [...new Set([...popularCategories.slice(0, 5), ...selectedCategories])];

  // Get visible values (first 5 + selected ones)
  const visibleValues = expandedValues 
    ? popularValues 
    : [...new Set([...popularValues.slice(0, 5), ...selectedValues])];

  return (
    <div className="ventures-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero hero-compact">
          <div className="hero-content">
            <h1 className="hero-title">
              Discover Amazing<br />
              <span className="gradient-text">Ventures</span>
            </h1>
            <p className="hero-subtitle">
              Explore innovative projects and missions that are looking for the right people to bring them to life.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section">
          <div className="content-card">
            <div className="section-header">
              <div className="eyebrow">How It Works</div>
              <h2 className="section-title">
                Find the perfect venture for your skills
              </h2>
            </div>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Send a Quick Intro</h3>
                  <p className="step-description">
                    Share a little about your experience, your values, and the type of work you're looking to contribute to.
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
                    Begin collaborating and working to help turn the idea into reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Matches Section */}
        <RecommendationSection 
          title="Recommended Experts for You"
          description="Based on your venture needs, values, and interests, here are some experts that might be a great fit for collaboration."
          maxResults={6}
        />

        {/* Main Content - Sidebar Layout */}
        <section className="section">
          <div className="experts-layout">
            {/* Left Sidebar - Search and Filters */}
            <div className="experts-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Find Ventures</h3>
                
                {/* Search Bar */}
                <div className="search-section">
                  <label className="search-label">Search</label>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search by name, description, skills needed..."
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
                      <span className="checkbox-text">Include remote ventures</span>
                    </label>
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="filter-section">
                  <h4 className="filter-title">Venture Categories</h4>
                  <div className="filter-tags">
                    {visibleCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`filter-tag ${
                          selectedCategories.includes(category) ? 'filter-tag-active' : ''
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {popularCategories.length > 5 && (
                    <button
                      onClick={() => setExpandedCategories(!expandedCategories)}
                      className="expand-collapse-btn"
                    >
                      {expandedCategories ? 'Show Less' : `Show ${popularCategories.length - 5} More`}
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
                {(selectedCategories.length > 0 || selectedValues.length > 0 || searchTerm || locationFilter || usOnly) && (
                  <div className="active-filters">
                    <h4 className="filter-title">Active Filters</h4>
                    <div className="active-filter-tags">
                      {selectedCategories.map(category => (
                        <span key={category} className="active-filter-tag skill-filter">
                          {category} ×
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
                    {isLoading ? 'Loading ventures...' : 
                     `${filteredVentures.length} venture${filteredVentures.length !== 1 ? 's' : ''} found`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Venture Listings */}
            <div className="experts-content">
              {isLoading ? (
                <div className="loading-state">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <h3 className="loading-title">Loading Ventures</h3>
                  <p className="loading-text">Finding amazing projects...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <div className="error-icon">⚠️</div>
                  <h3 className="error-title">Error Loading Ventures</h3>
                  <p className="error-text">{error}</p>
                  <button
                    onClick={loadVentures}
                    className="btn btn-primary"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredVentures.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3 className="empty-title">No Ventures Found</h3>
                  <p className="empty-text">
                    Try adjusting your search terms or filters to find more ventures.
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
                    {currentVentures.map((venture) => (
                      <div key={venture.id} className="expert-list-item">
                        <div className="expert-list-content">
                          <div className="expert-list-header">
                            <h3 className="expert-list-name">{venture.username}</h3>
                            <span className="expert-list-type">{getUserTypeDisplay(venture.userType)}</span>
                          </div>
                          
                          <div className="expert-list-bio">
                            {venture.expertSupportNeeded ? (
                              <div>
                                <p className="expert-bio-text line-clamp-2 font-medium mb-2">
                                  {venture.expertSupportNeeded}
                                </p>
                                {venture.skills && (
                                  <div className="expert-list-skills">
                                    <span className="expert-list-label text-sm text-gray-600">Skills needed:</span>
                                    <div className="expert-list-tags mt-1">
                                      {venture.skills.split(',').slice(0, 4).map((skill, index) => (
                                        <span key={index} className="expert-list-tag skill-tag">
                                          {skill.trim()}
                                        </span>
                                      ))}
                                      {venture.skills.split(',').length > 4 && (
                                        <span className="expert-list-tag-more">
                                          +{venture.skills.split(',').length - 4} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : venture.bio ? (
                              <p className="expert-bio-text line-clamp-1">{venture.bio}</p>
                            ) : (
                              <p className="expert-bio-placeholder">No description provided yet.</p>
                            )}
                          </div>

                          <div className="expert-list-details">
                            {venture.ventureInterests && (
                              <div className="expert-list-skills">
                                <span className="expert-list-label">Categories:</span>
                                <div className="expert-list-tags">
                                  {venture.ventureInterests.split(',').slice(0, 3).map((interest, index) => (
                                    <span key={index} className="expert-list-tag skill-tag">
                                      {interest.trim()}
                                    </span>
                                  ))}
                                  {venture.ventureInterests.split(',').length > 3 && (
                                    <span className="expert-list-tag-more">
                                      +{venture.ventureInterests.split(',').length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {venture.preferredEngagement && (
                              <div className="expert-list-engagement">
                                <span className="expert-list-label">Engagement:</span>
                                <div className="expert-list-tags">
                                  {venture.preferredEngagement.split(',').slice(0, 2).map((engagement, index) => (
                                    <span key={index} className="expert-list-tag engagement-tag">
                                      {engagement.trim()}
                                    </span>
                                  ))}
                                  {venture.preferredEngagement.split(',').length > 2 && (
                                    <span className="expert-list-tag-more">
                                      +{venture.preferredEngagement.split(',').length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="expert-list-meta">
                            <div className="expert-list-meta-row">
                              {venture.location && (
                                <div className="expert-list-location">
                                  📍 {venture.location}
                                  {venture.timezone && !venture.location.toLowerCase().includes('remote') && (
                                    <span className="expert-list-timezone">
                                      • {venture.timezone}
                                    </span>
                                  )}
                                </div>
                              )}
                              {venture.timeCommitment && (
                                <div className="expert-list-commitment">
                                  <span className="commitment-pill">
                                    ⏰ {venture.timeCommitment}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="expert-list-actions">
                          <button
                            onClick={() => handleViewProfile(venture.username)}
                            className="btn btn-primary"
                          >
                            View Venture
                          </button>
                          {venture.messagingEnabled !== false && (
                            <button
                              onClick={() => navigate(`/messages?compose=true&recipient=${venture.username}`)}
                              className="btn btn-outline"
                            >
                              💬 Message
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <div className="pagination-info">
                        <span className="pagination-text">
                          Showing {startIndex + 1}-{Math.min(endIndex, filteredVentures.length)} of {filteredVentures.length} ventures
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
            <h2 className="section-title">
              {isAuthenticated ? 'Ready to explore?' : 'Ready to find your next project?'}
            </h2>
          </div>
          <p className="cta-text">
            {isAuthenticated 
              ? 'Browse ventures and find your next opportunity to make an impact.'
              : 'Join our community of experts and help bring amazing ventures to life.'
            }
          </p>
          {!isAuthenticated ? (
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={handleSignUp}>
                Sign Up
              </button>
              <button className="btn btn-outline btn-large" onClick={() => navigate('/login')}>
                Log In
              </button>
            </div>
          ) : (
            <div className="cta-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate('/my-account')}>
                My Account
              </button>
            </div>
          )}
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">{ventures.length}+</span>
              <span className="trust-label">Ventures available</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">50+</span>
              <span className="trust-label">Categories</span>
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

export default VenturesPage; 
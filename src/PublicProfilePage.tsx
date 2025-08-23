import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { 
  ListUserProfilesQuery,
  UserProfileUserType
} from '../API';
import { listUserProfiles } from '../queries';
import { formatTimezone, getTimeInTimezone, isRemoteLocation, detectTimezoneFromLocation } from './utils/locationUtils';
import { getMissionValueNames } from './data/missionValues';


import { getCachedProfile, setCachedProfile, getCachedProfileFromStorage, clearProfileCache } from './utils/profileCache';

const PublicProfilePage: React.FC = (): React.ReactNode => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<null | {
    username: string;
    userType: UserProfileUserType;
    bio: string;
    experience: string;
    skills: string;
    location: string;
    values: string;
    timeCommitment: string;
    expertSupportNeeded: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    websiteUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    messagingEnabled?: boolean | null;
    accountStatus?: string | null;
    statusMessage?: string | null;
    // New fields that will be available after schema deployment
    missionValuesAlignment?: string;

    timezone?: string;
    latitude?: number;
    longitude?: number;
  }>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load profile from AWS database on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!username) {
        setError('No username provided');
        setIsLoading(false);
        return;
      }

      console.log('🔍 Loading public profile for username:', username);
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check cache first for instant loading
        const cacheKey = `public_${username}`;
        const cachedProfile = getCachedProfile(cacheKey) || getCachedProfileFromStorage(cacheKey);
        
        if (cachedProfile) {
          console.log('⚡ Loading profile from cache');
          setProfile(cachedProfile);
          setIsLoading(false);
          
          // Refresh cache in background
          setTimeout(() => loadProfileFromAPI(cacheKey), 100);
          return;
        }
        
        await loadProfileFromAPI(cacheKey);
        
      } catch (err) {
        console.error('❌ Error loading profile:', err);
        setError(`Error loading profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    const loadProfileFromAPI = async (cacheKey: string) => {
      try {
        const client = generateClient();
        console.log('✅ AWS API client generated successfully');
        
        // Query the AWS database for user's profile by username
        const result = await client.graphql({
          query: listUserProfiles,
          variables: {
            filter: {
              username: { eq: username }
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
          const profileData = {
            username: dbProfile.username || '',
            userType: dbProfile.userType || UserProfileUserType.both,
            bio: dbProfile.bio || '',
            experience: dbProfile.experience || '',
            skills: dbProfile.skills || '',
            location: dbProfile.location || '',
            values: dbProfile.values || '',
            timeCommitment: dbProfile.timeCommitment || '',
            expertSupportNeeded: dbProfile.expertSupportNeeded || '',
            linkedinUrl: dbProfile.linkedinUrl || '',
            githubUrl: dbProfile.githubUrl || '',
            portfolioUrl: dbProfile.portfolioUrl || '',
            websiteUrl: dbProfile.websiteUrl || '',
            twitterUrl: dbProfile.twitterUrl || '',
            instagramUrl: dbProfile.instagramUrl || '',
            messagingEnabled: dbProfile.messagingEnabled !== undefined ? dbProfile.messagingEnabled : true,
            accountStatus: dbProfile.accountStatus || 'active',
            statusMessage: dbProfile.statusMessage || '',
            // Multi-select fields from database
            missionValuesAlignment: dbProfile.missionValuesAlignment || '',
            
            timezone: dbProfile.timezone || detectTimezoneFromLocation(dbProfile.location || ''),
            latitude: dbProfile.latitude || undefined,
            longitude: dbProfile.longitude || undefined
          };
          
          // Note: timeCommitment is now loaded directly from the database
          
          console.log('📄 Converted profile data:', profileData);
          
          // Cache the profile for future requests
          setCachedProfile(cacheKey, profileData);
          
          setProfile(profileData);
        } else {
          console.log('📝 No profile found in AWS database for username:', username);
          setError('Profile not found');
        }
        
      } catch (err) {
        console.error('❌ Error loading profile from API:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const getUserTypeDisplay = (userType: UserProfileUserType) => {
    switch (userType) {
      case UserProfileUserType.expert:
        return 'Expert';
      case UserProfileUserType.ventures:
        return 'Venture';
      case UserProfileUserType.both:
        return 'Expert & Venture';
      default:
        return 'User';
    }
  };

  const getUserTypeDescription = (userType: UserProfileUserType) => {
    switch (userType) {
      case UserProfileUserType.expert:
        return 'Skilled professional ready to help bring ideas to life';
      case UserProfileUserType.ventures:
        return 'Building something meaningful and looking for the right people';
      case UserProfileUserType.both:
        return 'Both an expert and a venture builder - versatile collaborator';
      default:
        return 'Member of the Sandhill community';
    }
  };

  if (isLoading) {
    return (
      <div className="public-profile-page">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Profile</h2>
            <p className="text-gray-600">Please wait...</p>
            <button
              onClick={() => {
                clearProfileCache(`public_${username}`);
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="public-profile-page">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 max-w-2xl mx-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
              <p className="text-gray-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Go Home
                </button>
                <button
                  onClick={() => navigate('/experts')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Experts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-profile-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="mb-4">
              <span className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                {getUserTypeDisplay(profile.userType)}
              </span>
            </div>
            <h1 className="hero-title">
              {profile.username}
            </h1>
            <p className="hero-subtitle">
              {getUserTypeDescription(profile.userType)}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {/* Message Button - Only show if user is authenticated and messaging is enabled */}
              {profile.messagingEnabled !== false && (
                <button
                  onClick={() => navigate(`/messages?compose=true&recipient=${profile.username}`)}
                  className="btn btn-primary btn-large"
                >
                  💬 Send Message
                </button>
              )}
              
              {/* Refresh Button */}
              <button
                onClick={() => {
                  clearProfileCache(`public_${profile.username}`);
                  window.location.reload();
                }}
                className="btn btn-outline btn-large"
                title="Refresh profile data"
              >
                🔄 Refresh
              </button>
            </div>

          </div>
        </section>

        {/* Account Status Alert */}
        {(profile.accountStatus === 'busy' || profile.accountStatus === 'inactive') && (
          <section className="section">
            <div className={`content-card ${profile.accountStatus === 'busy' ? 'border-orange-200 bg-orange-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  profile.accountStatus === 'busy' ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  <span className="text-white text-sm font-bold">
                    {profile.accountStatus === 'busy' ? '!' : '⏸'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    profile.accountStatus === 'busy' ? 'text-orange-800' : 'text-red-800'
                  }`}>
                    {profile.accountStatus === 'busy' ? 'Currently Busy' : 'Not Taking New Work'}
                  </h3>
                  {profile.statusMessage && (
                    <p className={`text-sm ${
                      profile.accountStatus === 'busy' ? 'text-orange-700' : 'text-red-700'
                    }`}>
                      {profile.statusMessage}
                    </p>
                  )}
                  <p className={`text-xs mt-2 ${
                    profile.accountStatus === 'busy' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {profile.accountStatus === 'busy' 
                      ? 'This person is currently focused on other projects and may have limited availability.'
                      : 'This person is not currently taking on new opportunities or collaborations.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <section className="section">
            <div className="content-card">
              <div className="space-y-8 text-left">
                {/* What I'm Building - Moved to top for ventures */}
                {(profile.userType === 'ventures' || profile.userType === 'both') && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">What I'm Building</h3>
                    {profile.expertSupportNeeded ? (
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.expertSupportNeeded}</p>
                    ) : (
                      <p className="text-gray-500 italic">No details about what they're building yet.</p>
                    )}
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Values (if not already shown in Mission & Values Alignment) */}
                {profile.values && !profile.missionValuesAlignment && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Values</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.values}</p>
                  </div>
                )}



                {/* Skills */}
                {profile.skills && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {profile.userType === 'ventures' ? 'Skills Needed' : 'Skills I Have'}
                    </h3>
                    <ul className="list-none p-0 m-0">
                      {profile.skills.split(',').map((skill, index) => (
                        <li key={index} className="inline-block mb-3 mr-3">
                          <span className="bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 hover:from-orange-200 hover:to-teal-200 transition-all duration-300">
                            {skill.trim()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mission & Values Alignment */}
                <div className="feature-card">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission & Values</h3>
                  {profile.missionValuesAlignment ? (
                    <>
                      <ul className="list-none p-0 m-0 mb-4">
                        {profile.missionValuesAlignment.split(',').map((value, index) => (
                          <li key={index} className="inline-block mb-3 mr-3">
                            <span className="bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                              {value.trim()}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {profile.values && (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.values}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No mission and values information provided yet.</p>
                  )}
                </div>



                {/* Location and Connect - Side by Side */}
                <div className="grid-2">
                  {/* Location */}
                  {profile.location && (
                    <div className="feature-card">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                      <p className="text-gray-700 text-lg">{profile.location}</p>
                      {profile.timezone ? (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimezone(profile.timezone)}
                          {!isRemoteLocation(profile.location) && (
                            <span className="ml-2">
                              • {getTimeInTimezone(profile.timezone)}
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Timezone will be auto-detected from location
                        </p>
                      )}
                    </div>
                  )}

                  {/* Connect */}
                  {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl || profile.websiteUrl || profile.twitterUrl || profile.instagramUrl) && (
                    <div className="feature-card">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect</h3>
                      <ul className="space-y-3">
                        {profile.linkedinUrl && (
                          <li>
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                              <span className="w-4 h-4 mr-2">🔗</span>
                              LinkedIn
                            </a>
                          </li>
                        )}
                        {profile.githubUrl && (
                          <li>
                            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors flex items-center">
                              <span className="w-4 h-4 mr-2">🔗</span>
                              GitHub
                            </a>
                          </li>
                        )}
                        {profile.portfolioUrl && (
                          <li>
                            <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition-colors flex items-center">
                              <span className="w-4 h-4 mr-2">🔗</span>
                              Portfolio
                            </a>
                          </li>
                        )}
                        {profile.websiteUrl && (
                          <li>
                            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors flex items-center">
                              <span className="w-4 h-4 mr-2">🔗</span>
                              Website
                            </a>
                          </li>
                        )}
                        {profile.twitterUrl && (
                          <li>
                            <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors flex items-center">
                              <span className="w-4 h-4 mr-2">🔗</span>
                              Twitter
                            </a>
                          </li>
                        )}
                        {profile.instagramUrl && (
                          <li>
                            <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors flex items-center">
                              <span className="w-4 h-4 mr-2">🔗</span>
                              Instagram
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Time Commitment - Separate section for experts */}
                {profile.userType === 'expert' && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Commitment</h3>
                    {profile.timeCommitment ? (
                      <p className="text-gray-700 text-lg">{profile.timeCommitment}</p>
                    ) : (
                      <p className="text-gray-500 italic">No time commitment specified yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="section">
            <div className="cta-section">
              <h3 className="section-title">
                {profile.userType === 'ventures' ? 'Browse Experts' : 'Browse Ventures'}
              </h3>
              <p className="cta-text">
                {profile.userType === 'ventures' 
                  ? 'Find the perfect expert to help bring your venture to life.'
                  : 'Discover exciting ventures and opportunities to get involved with.'
                }
              </p>
              <div className="cta-buttons">
                <button
                  onClick={() => navigate(profile.userType === 'ventures' ? '/experts' : '/ventures')}
                  className="btn btn-primary btn-large"
                >
                  {profile.userType === 'ventures' ? 'Browse Experts' : 'Browse Ventures'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;

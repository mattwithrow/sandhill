import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateClient } from "aws-amplify/api";
import { 
  ListUserProfilesQuery,
  UserProfileUserType
} from '../API';
import { listUserProfiles } from '../queries';

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
  }>(null);

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
            timeCommitment: '', // TODO: Add back after schema deployment
            expertSupportNeeded: '', // TODO: Add back after schema deployment
            linkedinUrl: dbProfile.linkedinUrl || '',
            githubUrl: dbProfile.githubUrl || '',
            portfolioUrl: dbProfile.portfolioUrl || '',
            websiteUrl: dbProfile.websiteUrl || '',
            twitterUrl: dbProfile.twitterUrl || '',
            instagramUrl: dbProfile.instagramUrl || ''
          };
          
          console.log('📄 Converted profile data:', profileData);
          setProfile(profileData);
        } else {
          console.log('📝 No profile found in AWS database for username:', username);
          setError('Profile not found');
        }
        
      } catch (err) {
        console.error('❌ Error loading profile:', err);
        setError(`Error loading profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
            
            <div className="cta-buttons">
              <button
                onClick={() => navigate('/experts')}
                className="btn btn-primary btn-large"
              >
                Find More Experts
              </button>
              <button
                onClick={() => navigate('/ventures')}
                className="btn btn-outline btn-large"
              >
                Discover Ventures
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <section className="section">
            <div className="content-card">
              <div className="space-y-8">
                {/* Bio */}
                {profile.bio && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Values */}
                {profile.values && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Values</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.values}</p>
                  </div>
                )}

                {/* Experience */}
                {profile.experience && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Experience</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.experience}</p>
                  </div>
                )}

                {/* Skills */}
                {profile.skills && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 hover:from-orange-200 hover:to-teal-200 transition-all duration-300"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* TODO: Add back after schema deployment
                {/* Expert Support Needed (for Ventures and Both) */}
                {profile.expertSupportNeeded && (profile.userType === 'ventures' || profile.userType === 'both') && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Expert Support Needed</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{profile.expertSupportNeeded}</p>
                  </div>
                )}
                */}

                {/* Location and Time Commitment */}
                <div className="grid-2">
                  {profile.location && (
                    <div className="feature-card">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                      <p className="text-gray-700 text-lg">{profile.location}</p>
                    </div>
                  )}
                  {/* TODO: Add back after schema deployment
                  {profile.timeCommitment && (profile.userType === 'expert' || profile.userType === 'both') && (
                    <div className="feature-card">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Commitment</h3>
                      <p className="text-gray-700 text-lg">{profile.timeCommitment}</p>
                    </div>
                  )}
                  */}
                </div>

                {/* Social Links */}
                {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl || profile.websiteUrl || profile.twitterUrl || profile.instagramUrl) && (
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Connect</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.linkedinUrl && (
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                          LinkedIn
                        </a>
                      )}
                      {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600 transition-colors">
                          GitHub
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition-colors">
                          Portfolio
                        </a>
                      )}
                      {profile.websiteUrl && (
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors">
                          Website
                        </a>
                      )}
                      {profile.twitterUrl && (
                        <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition-colors">
                          Twitter
                        </a>
                      )}
                      {profile.instagramUrl && (
                        <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors">
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="section">
            <div className="cta-section">
              <h3 className="section-title">Ready to Connect?</h3>
              <p className="cta-text">
                Join Sandhill to discover amazing people and build something great together.
              </p>
              <div className="cta-buttons">
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary btn-large"
                >
                  Join Sandhill
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

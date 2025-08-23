import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/api";
import { listUserProfiles } from '../../queries';
import { generateRecommendations, ProfileData, MatchScore } from '../utils/recommendationUtils';

interface RecommendationSectionProps {
  title: string;
  description: string;
  maxResults?: number;
  userType?: 'expert' | 'venture';
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({ 
  title, 
  description, 
  maxResults = 6,
  userType 
}) => {
  const navigate = useNavigate();
  const { user, authStatus } = useAuthenticator();
  const [recommendations, setRecommendations] = useState<MatchScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      loadRecommendations();
    } else {
      setIsLoading(false);
    }
  }, [authStatus, user]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = generateClient();
      
      // Load all profiles for recommendation calculation
      const result = await client.graphql({
        query: listUserProfiles,
        variables: {}
      });

      const allProfiles = result.data?.listUserProfiles?.items || [];
      
      // Convert to ProfileData format
      const profiles: ProfileData[] = allProfiles.map((profile: any) => ({
        id: profile.id,
        username: profile.username || '',
        userType: profile.userType || 'expert',
        bio: profile.bio || '',
        experience: profile.experience || '',
        skills: profile.skills || '',
        location: profile.location || '',
        values: profile.values || '',
        missionValuesAlignment: profile.missionValuesAlignment || '',
        ventureInterests: profile.ventureInterests || '',

        timeCommitment: profile.timeCommitment || '',
        expertSupportNeeded: profile.expertSupportNeeded || '',
        ventureInterestsDescription: profile.ventureInterestsDescription || '',
        accountStatus: profile.accountStatus || 'active',
        isProfileHidden: profile.isProfileHidden || false
      }));

      // Separate experts and ventures
      const experts = profiles.filter(p => 
        (p.userType === 'expert' || p.userType === 'both') &&
        !p.isProfileHidden && 
        p.accountStatus !== 'inactive'
      );
      
      const ventures = profiles.filter(p => 
        (p.userType === 'ventures' || p.userType === 'both') &&
        !p.isProfileHidden && 
        p.accountStatus !== 'inactive'
      );

      // Generate recommendations
      const recs = generateRecommendations(experts, ventures, maxResults);
      setRecommendations(recs);

    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (authStatus !== 'authenticated') {
    return null; // Don't show recommendations for non-authenticated users
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="content-card">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="content-card">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadRecommendations}
              className="btn btn-outline"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section className="section">
        <div className="content-card">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {userType === 'expert' ? 'No Venture Matches Yet' : 'No Expert Matches Yet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {userType === 'expert' 
                  ? "Complete your profile to discover ventures that need your skills!"
                  : "Complete your profile to find experts who can help bring your vision to life!"
                }
              </p>
            </div>
            


            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => navigate('/my-account')}
                className="btn btn-primary"
              >
                Complete My Profile
              </button>
              <button 
                onClick={loadRecommendations}
                className="btn btn-outline"
              >
                Refresh Recommendations
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="content-card">
        <div className="text-center mb-8">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((match, index) => (
            <div 
              key={`${match.expertId}-${match.ventureId}`}
              className="recommendation-card bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/profile/${match.ventureUsername}`)}
            >
              {/* Match Score Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Match</span>
                  <div className="match-score-badge text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(match.score)}%
                  </div>
                </div>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>

              {/* Venture Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {match.ventureUsername}
                </h3>
                <p className="text-sm text-gray-600">
                  Looking for: {match.expertUsername}
                </p>
              </div>

              {/* Match Reasons */}
              <div className="space-y-2">
                {match.reasons.slice(0, 3).map((reason, idx) => (
                  <div key={idx} className="match-reason-item flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{reason}</span>
                  </div>
                ))}
                {match.reasons.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{match.reasons.length - 3} more reasons
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  className="w-full btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${match.ventureUsername}`);
                  }}
                >
                  View Venture
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button 
            onClick={loadRecommendations}
            className="btn btn-outline"
          >
            Refresh Recommendations
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;

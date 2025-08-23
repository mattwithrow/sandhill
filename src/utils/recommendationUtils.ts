// Recommendation algorithm utilities for matching experts and ventures

export interface ProfileData {
  id: string;
  username: string;
  userType: 'expert' | 'ventures' | 'both';
  bio: string;
  experience: string;
  skills: string;
  location: string;
  values: string;
  missionValuesAlignment: string;
  ventureInterests: string;

  timeCommitment: string;
  expertSupportNeeded: string;
  ventureInterestsDescription: string;
  accountStatus?: string;
  isProfileHidden?: boolean;
}

export interface MatchScore {
  expertId: string;
  ventureId: string;
  expertUsername: string;
  ventureUsername: string;
  score: number;
  reasons: string[];
}

// Calculate similarity between two text fields
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  return totalWords > 0 ? (commonWords.length / totalWords) * 100 : 0;
}

// Calculate skills match between expert skills and venture needs
function calculateSkillsMatch(expertSkills: string, ventureNeeds: string): number {
  if (!expertSkills || !ventureNeeds) return 0;
  
  const expertSkillList = expertSkills.toLowerCase().split(',').map(s => s.trim());
  const ventureNeedList = ventureNeeds.toLowerCase().split(',').map(s => s.trim());
  
  if (expertSkillList.length === 0 || ventureNeedList.length === 0) return 0;
  
  const matchingSkills = expertSkillList.filter(skill => 
    ventureNeedList.some(need => need.includes(skill) || skill.includes(need))
  );
  
  return (matchingSkills.length / Math.max(expertSkillList.length, ventureNeedList.length)) * 100;
}

// Calculate values alignment
function calculateValuesMatch(expertValues: string, ventureValues: string): number {
  return calculateTextSimilarity(expertValues, ventureValues);
}

// Calculate venture interests match
function calculateInterestsMatch(expertInterests: string, ventureInterests: string): number {
  return calculateTextSimilarity(expertInterests, ventureInterests);
}



// Calculate location compatibility
function calculateLocationMatch(expertLocation: string, ventureLocation: string): number {
  if (!expertLocation || !ventureLocation) return 0;
  
  const expertLoc = expertLocation.toLowerCase();
  const ventureLoc = ventureLocation.toLowerCase();
  
  // Exact match
  if (expertLoc === ventureLoc) return 100;
  
  // Both remote
  if (expertLoc.includes('remote') && ventureLoc.includes('remote')) return 90;
  
  // One is remote
  if (expertLoc.includes('remote') || ventureLoc.includes('remote')) return 70;
  
  // Same city/region
  if (expertLoc.includes(ventureLoc) || ventureLoc.includes(expertLoc)) return 80;
  
  return 0;
}

// Generate match reasons
function generateMatchReasons(
  expert: ProfileData, 
  venture: ProfileData, 
  skillsScore: number,
  valuesScore: number,
  interestsScore: number,
  engagementScore: number,
  locationScore: number
): string[] {
  const reasons: string[] = [];
  
  if (skillsScore > 50) {
    reasons.push(`Skills match: ${Math.round(skillsScore)}%`);
  }
  
  if (valuesScore > 30) {
    reasons.push(`Values alignment: ${Math.round(valuesScore)}%`);
  }
  
  if (interestsScore > 30) {
    reasons.push(`Venture interests: ${Math.round(interestsScore)}%`);
  }
  
  if (engagementScore > 40) {
    reasons.push(`Engagement preferences: ${Math.round(engagementScore)}%`);
  }
  
  if (locationScore > 70) {
    reasons.push(`Location compatible: ${Math.round(locationScore)}%`);
  }
  
  return reasons;
}

// Main recommendation function
export function generateRecommendations(
  experts: ProfileData[], 
  ventures: ProfileData[],
  maxResults: number = 6
): MatchScore[] {
  const matches: MatchScore[] = [];
  
  // Filter out hidden profiles and inactive users
  const activeExperts = experts.filter(expert => 
    !expert.isProfileHidden && 
    expert.accountStatus !== 'inactive' &&
    (expert.userType === 'expert' || expert.userType === 'both')
  );
  
  const activeVentures = ventures.filter(venture => 
    !venture.isProfileHidden && 
    venture.accountStatus !== 'inactive' &&
    (venture.userType === 'ventures' || venture.userType === 'both')
  );
  
  for (const expert of activeExperts) {
    for (const venture of activeVentures) {
      // Calculate individual scores
      const skillsScore = calculateSkillsMatch(expert.skills, venture.expertSupportNeeded);
      const valuesScore = calculateValuesMatch(expert.missionValuesAlignment, venture.missionValuesAlignment);
      const interestsScore = calculateInterestsMatch(expert.ventureInterests, venture.ventureInterests);
      const engagementScore = 0; // Engagement matching removed
      const locationScore = calculateLocationMatch(expert.location, venture.location);
      
      // Weighted average score
      const weightedScore = (
        skillsScore * 0.35 +      // Skills are most important
        valuesScore * 0.25 +      // Values alignment is important
        interestsScore * 0.20 +   // Venture interests matter
        engagementScore * 0.15 +  // Engagement preferences
        locationScore * 0.05      // Location is least important
      );
      
      // Only include matches with reasonable scores
      if (weightedScore > 20) {
        const reasons = generateMatchReasons(
          expert, venture, skillsScore, valuesScore, 
          interestsScore, engagementScore, locationScore
        );
        
        matches.push({
          expertId: expert.id,
          ventureId: venture.id,
          expertUsername: expert.username,
          ventureUsername: venture.username,
          score: weightedScore,
          reasons
        });
      }
    }
  }
  
  // Sort by score and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

// Get recommendations for a specific user
export function getUserRecommendations(
  userProfile: ProfileData,
  allProfiles: ProfileData[],
  maxResults: number = 6
): MatchScore[] {
  if (userProfile.userType === 'expert' || userProfile.userType === 'both') {
    // Expert looking for ventures
    const ventures = allProfiles.filter(p => 
      (p.userType === 'ventures' || p.userType === 'both') &&
      !p.isProfileHidden && 
      p.accountStatus !== 'inactive'
    );
    
    return generateRecommendations([userProfile], ventures, maxResults);
  } else if (userProfile.userType === 'ventures') {
    // Venture looking for experts
    const experts = allProfiles.filter(p => 
      (p.userType === 'expert' || p.userType === 'both') &&
      !p.isProfileHidden && 
      p.accountStatus !== 'inactive'
    );
    
    return generateRecommendations(experts, [userProfile], maxResults);
  }
  
  return [];
}

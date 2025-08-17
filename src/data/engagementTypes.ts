export interface EngagementType {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const ENGAGEMENT_TYPES: EngagementType[] = [
  // Advisory
  { id: 'advisory', name: 'Advisory', category: 'Advisory', description: 'Strategic guidance and advice' },
  { id: 'board-member', name: 'Board Member', category: 'Advisory', description: 'Serving on board of directors' },
  { id: 'mentorship', name: 'Mentorship', category: 'Advisory', description: 'One-on-one mentoring and coaching' },
  { id: 'consulting', name: 'Consulting', category: 'Advisory', description: 'Professional consulting services' },
  { id: 'strategy', name: 'Strategy', category: 'Advisory', description: 'Strategic planning and direction' },
  { id: 'governance', name: 'Governance', category: 'Advisory', description: 'Corporate governance and compliance' },

  // Hands-on Work
  { id: 'hands-on', name: 'Hands-on Work', category: 'Hands-on Work', description: 'Direct involvement in operations' },
  { id: 'development', name: 'Development', category: 'Hands-on Work', description: 'Technical development and coding' },
  { id: 'design', name: 'Design', category: 'Hands-on Work', description: 'Product and UX/UI design' },
  { id: 'marketing', name: 'Marketing', category: 'Hands-on Work', description: 'Marketing and growth activities' },
  { id: 'sales', name: 'Sales', category: 'Hands-on Work', description: 'Sales and business development' },
  { id: 'operations', name: 'Operations', category: 'Hands-on Work', description: 'Operational management' },
  { id: 'product', name: 'Product Management', category: 'Hands-on Work', description: 'Product management and strategy' },
  { id: 'data', name: 'Data Analysis', category: 'Hands-on Work', description: 'Data analysis and insights' },
  { id: 'research', name: 'Research', category: 'Hands-on Work', description: 'Research and development' },
  { id: 'content', name: 'Content Creation', category: 'Hands-on Work', description: 'Content creation and copywriting' },
  { id: 'community', name: 'Community Building', category: 'Hands-on Work', description: 'Community management and engagement' },
  { id: 'support', name: 'Customer Support', category: 'Hands-on Work', description: 'Customer support and success' },
  { id: 'legal', name: 'Legal', category: 'Hands-on Work', description: 'Legal and compliance work' },
  { id: 'finance', name: 'Finance', category: 'Hands-on Work', description: 'Financial management and accounting' },
  { id: 'hr', name: 'Human Resources', category: 'Hands-on Work', description: 'HR and talent management' },

  // Investment
  { id: 'investing', name: 'Investing', category: 'Investment', description: 'Financial investment and funding' },
  { id: 'angel-investing', name: 'Angel Investing', category: 'Investment', description: 'Early-stage angel investment' },
  { id: 'venture-capital', name: 'Venture Capital', category: 'Investment', description: 'Venture capital investment' },
  { id: 'crowdfunding', name: 'Crowdfunding', category: 'Investment', description: 'Crowdfunding and community funding' },
  { id: 'grants', name: 'Grants', category: 'Investment', description: 'Grant writing and funding' },
  { id: 'fundraising', name: 'Fundraising', category: 'Investment', description: 'Fundraising and capital raising' },
  { id: 'due-diligence', name: 'Due Diligence', category: 'Investment', description: 'Investment due diligence' },
  { id: 'valuation', name: 'Valuation', category: 'Investment', description: 'Business valuation and assessment' },

  // Partnership
  { id: 'partnership', name: 'Partnership', category: 'Partnership', description: 'Strategic partnerships and alliances' },
  { id: 'joint-venture', name: 'Joint Venture', category: 'Partnership', description: 'Joint venture opportunities' },
  { id: 'distribution', name: 'Distribution', category: 'Partnership', description: 'Distribution and channel partnerships' },
  { id: 'supply-chain', name: 'Supply Chain', category: 'Partnership', description: 'Supply chain partnerships' },
  { id: 'co-marketing', name: 'Co-marketing', category: 'Partnership', description: 'Co-marketing and promotional partnerships' },
  { id: 'technology-partnership', name: 'Technology Partnership', category: 'Partnership', description: 'Technology and platform partnerships' },
  { id: 'research-partnership', name: 'Research Partnership', category: 'Partnership', description: 'Research and development partnerships' },
  { id: 'academic-partnership', name: 'Academic Partnership', category: 'Partnership', description: 'Academic and research institution partnerships' },

  // Networking
  { id: 'networking', name: 'Networking', category: 'Networking', description: 'Professional networking and connections' },
  { id: 'introductions', name: 'Introductions', category: 'Networking', description: 'Making introductions and connections' },
  { id: 'referrals', name: 'Referrals', category: 'Networking', description: 'Providing referrals and recommendations' },
  { id: 'speaking', name: 'Speaking', category: 'Networking', description: 'Public speaking and presentations' },
  { id: 'events', name: 'Events', category: 'Networking', description: 'Event organization and participation' },
  { id: 'conferences', name: 'Conferences', category: 'Networking', description: 'Conference speaking and attendance' },
  { id: 'workshops', name: 'Workshops', category: 'Networking', description: 'Workshop facilitation and training' },
  { id: 'webinars', name: 'Webinars', category: 'Networking', description: 'Webinar hosting and participation' },

  // Education
  { id: 'education', name: 'Education', category: 'Education', description: 'Educational programs and training' },
  { id: 'training', name: 'Training', category: 'Education', description: 'Training and skill development' },
  { id: 'workshops-education', name: 'Educational Workshops', category: 'Education', description: 'Educational workshop facilitation' },
  { id: 'curriculum', name: 'Curriculum Development', category: 'Education', description: 'Curriculum and program development' },
  { id: 'coaching', name: 'Coaching', category: 'Education', description: 'Professional coaching services' },
  { id: 'certification', name: 'Certification', category: 'Education', description: 'Certification programs' },
  { id: 'online-courses', name: 'Online Courses', category: 'Education', description: 'Online course development and delivery' },
  { id: 'bootcamps', name: 'Bootcamps', category: 'Education', description: 'Intensive training bootcamps' },

  // Advocacy
  { id: 'advocacy', name: 'Advocacy', category: 'Advocacy', description: 'Policy advocacy and lobbying' },
  { id: 'policy', name: 'Policy', category: 'Advocacy', description: 'Policy development and analysis' },
  { id: 'government-relations', name: 'Government Relations', category: 'Advocacy', description: 'Government relations and lobbying' },
  { id: 'public-affairs', name: 'Public Affairs', category: 'Advocacy', description: 'Public affairs and communications' },
  { id: 'campaigns', name: 'Campaigns', category: 'Advocacy', description: 'Advocacy campaigns and initiatives' },
  { id: 'grassroots', name: 'Grassroots Organizing', category: 'Advocacy', description: 'Grassroots organizing and mobilization' },
  { id: 'coalition-building', name: 'Coalition Building', category: 'Advocacy', description: 'Building advocacy coalitions' },
  { id: 'media-relations', name: 'Media Relations', category: 'Advocacy', description: 'Media relations and public relations' },

  // Research
  { id: 'research-engagement', name: 'Research', category: 'Research', description: 'Research and development' },
  { id: 'market-research', name: 'Market Research', category: 'Research', description: 'Market research and analysis' },
  { id: 'user-research', name: 'User Research', category: 'Research', description: 'User research and testing' },
  { id: 'competitive-analysis', name: 'Competitive Analysis', category: 'Research', description: 'Competitive analysis and benchmarking' },
  { id: 'feasibility-studies', name: 'Feasibility Studies', category: 'Research', description: 'Feasibility studies and assessments' },
  { id: 'impact-assessment', name: 'Impact Assessment', category: 'Research', description: 'Impact assessment and evaluation' },
  { id: 'data-analysis', name: 'Data Analysis', category: 'Research', description: 'Data analysis and insights' },
  { id: 'academic-research', name: 'Academic Research', category: 'Research', description: 'Academic research and publications' },

  // Volunteering
  { id: 'volunteering', name: 'Volunteering', category: 'Volunteering', description: 'Volunteer work and pro bono services' },
  { id: 'pro-bono', name: 'Pro Bono', category: 'Volunteering', description: 'Pro bono professional services' },
  { id: 'community-service', name: 'Community Service', category: 'Volunteering', description: 'Community service and outreach' },
  { id: 'skill-sharing', name: 'Skill Sharing', category: 'Volunteering', description: 'Sharing skills and knowledge' },
  { id: 'mentoring-volunteer', name: 'Volunteer Mentoring', category: 'Volunteering', description: 'Volunteer mentoring programs' },
  { id: 'board-volunteer', name: 'Volunteer Board', category: 'Volunteering', description: 'Volunteer board positions' },
  { id: 'event-volunteering', name: 'Event Volunteering', category: 'Volunteering', description: 'Event volunteering and support' },
  { id: 'crisis-response', name: 'Crisis Response', category: 'Volunteering', description: 'Crisis response and emergency support' },
];

// Create simplified engagement types with only category titles
export const SIMPLIFIED_ENGAGEMENT_TYPES: EngagementType[] = [
  { id: 'advisory', name: 'Advisory', category: 'Strategic Support', description: 'Strategic guidance, mentorship, and consulting' },
  { id: 'hands-on-work', name: 'Hands-on Work', category: 'Direct Involvement', description: 'Direct involvement in operations and development' },
  { id: 'investment', name: 'Investment', category: 'Financial Support', description: 'Financial investment and funding support' },
  { id: 'partnership', name: 'Partnership', category: 'Collaboration', description: 'Strategic partnerships and alliances' },
  { id: 'networking', name: 'Networking', category: 'Connections', description: 'Professional networking and connections' },
  { id: 'education', name: 'Education', category: 'Knowledge Sharing', description: 'Educational programs and training' },
  { id: 'advocacy', name: 'Advocacy', category: 'Policy & Influence', description: 'Policy advocacy and lobbying' },
  { id: 'research', name: 'Research', category: 'Analysis & Insights', description: 'Research and development activities' },
  { id: 'volunteering', name: 'Volunteering', category: 'Pro Bono Support', description: 'Volunteer work and pro bono services' },
];

export const ENGAGEMENT_CATEGORIES = Array.from(new Set(ENGAGEMENT_TYPES.map(type => type.category))).sort();

export const getEngagementTypesByCategory = () => {
  const typesByCategory: Record<string, EngagementType[]> = {};
  ENGAGEMENT_TYPES.forEach(type => {
    if (!typesByCategory[type.category]) {
      typesByCategory[type.category] = [];
    }
    typesByCategory[type.category].push(type);
  });
  return typesByCategory;
};

export const getEngagementTypeNames = (typeIds: string[]): string[] => {
  return typeIds
    .map(id => ENGAGEMENT_TYPES.find(type => type.id === id)?.name)
    .filter(Boolean) as string[];
};

export const getEngagementTypeIds = (typeNames: string[]): string[] => {
  return typeNames
    .map(name => ENGAGEMENT_TYPES.find(type => type.name.toLowerCase() === name.toLowerCase())?.id)
    .filter(Boolean) as string[];
};

// Functions for simplified engagement types
export const getSimplifiedEngagementTypeNames = (typeIds: string[]): string[] => {
  return typeIds
    .map(id => SIMPLIFIED_ENGAGEMENT_TYPES.find(type => type.id === id)?.name)
    .filter(Boolean) as string[];
};

export const getSimplifiedEngagementTypeIds = (typeNames: string[]): string[] => {
  return typeNames
    .map(name => SIMPLIFIED_ENGAGEMENT_TYPES.find(type => type.name.toLowerCase() === name.toLowerCase())?.id)
    .filter(Boolean) as string[];
};

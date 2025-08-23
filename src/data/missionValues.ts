export interface MissionValue {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const MISSION_VALUES: MissionValue[] = [
  // Social Impact
  { id: 'social-justice', name: 'Social Justice', category: 'Social Impact', description: 'Fighting inequality and promoting fairness' },
  { id: 'education-access', name: 'Education Access', category: 'Social Impact', description: 'Making quality education available to all' },
  { id: 'healthcare-equity', name: 'Healthcare Equity', category: 'Social Impact', description: 'Improving access to healthcare' },
  { id: 'poverty-alleviation', name: 'Poverty Alleviation', category: 'Social Impact', description: 'Reducing economic inequality' },
  { id: 'community-development', name: 'Community Development', category: 'Social Impact', description: 'Building stronger communities' },
  { id: 'diversity-inclusion', name: 'Diversity & Inclusion', category: 'Social Impact', description: 'Promoting representation and belonging' },
  { id: 'mental-health', name: 'Mental Health', category: 'Social Impact', description: 'Supporting mental wellness' },
  { id: 'disability-rights', name: 'Disability Rights', category: 'Social Impact', description: 'Advocating for accessibility' },
  { id: 'refugee-support', name: 'Refugee Support', category: 'Social Impact', description: 'Helping displaced populations' },
  { id: 'youth-empowerment', name: 'Youth Empowerment', category: 'Social Impact', description: 'Supporting young people' },

  // Environmental
  { id: 'sustainability', name: 'Sustainability', category: 'Environmental', description: 'Environmental stewardship and conservation' },
  { id: 'climate-action', name: 'Climate Action', category: 'Environmental', description: 'Addressing climate change' },
  { id: 'renewable-energy', name: 'Renewable Energy', category: 'Environmental', description: 'Clean energy solutions' },
  { id: 'circular-economy', name: 'Circular Economy', category: 'Environmental', description: 'Waste reduction and resource efficiency' },
  { id: 'biodiversity', name: 'Biodiversity', category: 'Environmental', description: 'Protecting ecosystems and species' },
  { id: 'ocean-conservation', name: 'Ocean Conservation', category: 'Environmental', description: 'Protecting marine environments' },
  { id: 'forest-preservation', name: 'Forest Preservation', category: 'Environmental', description: 'Protecting forests and trees' },
  { id: 'clean-water', name: 'Clean Water', category: 'Environmental', description: 'Water quality and access' },
  { id: 'air-quality', name: 'Air Quality', category: 'Environmental', description: 'Improving air pollution' },
  { id: 'green-tech', name: 'Green Technology', category: 'Environmental', description: 'Environmental technology solutions' },

  // Economic
  { id: 'economic-empowerment', name: 'Economic Empowerment', category: 'Economic', description: 'Financial independence and opportunity' },
  { id: 'financial-inclusion', name: 'Financial Inclusion', category: 'Economic', description: 'Access to financial services' },
  { id: 'job-creation', name: 'Job Creation', category: 'Economic', description: 'Creating meaningful employment' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Economic', description: 'Supporting business creation' },
  { id: 'local-economy', name: 'Local Economy', category: 'Economic', description: 'Strengthening local businesses' },
  { id: 'fair-trade', name: 'Fair Trade', category: 'Economic', description: 'Ethical business practices' },
  { id: 'cooperative-models', name: 'Cooperative Models', category: 'Economic', description: 'Worker-owned and cooperative businesses' },
  { id: 'microfinance', name: 'Microfinance', category: 'Economic', description: 'Small-scale financial services' },
  { id: 'supply-chain-ethics', name: 'Supply Chain Ethics', category: 'Economic', description: 'Ethical sourcing and production' },
  { id: 'economic-justice', name: 'Economic Justice', category: 'Economic', description: 'Fair economic systems' },

  // Technology
  { id: 'tech-for-good', name: 'Tech for Good', category: 'Technology', description: 'Technology that benefits society' },
  { id: 'digital-inclusion', name: 'Digital Inclusion', category: 'Technology', description: 'Bridging the digital divide' },
  { id: 'privacy-rights', name: 'Privacy Rights', category: 'Technology', description: 'Protecting personal data' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology', description: 'Digital security and protection' },
  { id: 'open-source', name: 'Open Source', category: 'Technology', description: 'Collaborative and accessible technology' },
  { id: 'ai-ethics', name: 'AI Ethics', category: 'Technology', description: 'Responsible artificial intelligence' },
  { id: 'digital-literacy', name: 'Digital Literacy', category: 'Technology', description: 'Technology education and skills' },
  { id: 'accessibility-tech', name: 'Accessibility Tech', category: 'Technology', description: 'Technology for people with disabilities' },
  { id: 'smart-cities', name: 'Smart Cities', category: 'Technology', description: 'Technology for urban improvement' },
  { id: 'blockchain-social', name: 'Blockchain for Social Good', category: 'Technology', description: 'Blockchain for social impact' },

  // Health & Wellness
  { id: 'preventive-health', name: 'Preventive Health', category: 'Health & Wellness', description: 'Preventing illness and promoting wellness' },
  { id: 'mental-wellness', name: 'Mental Wellness', category: 'Health & Wellness', description: 'Mental health and emotional well-being' },
  { id: 'nutrition', name: 'Nutrition', category: 'Health & Wellness', description: 'Healthy eating and food access' },
  { id: 'physical-fitness', name: 'Physical Fitness', category: 'Health & Wellness', description: 'Physical health and activity' },
  { id: 'aging-well', name: 'Aging Well', category: 'Health & Wellness', description: 'Supporting healthy aging' },
  { id: 'women-health', name: 'Women\'s Health', category: 'Health & Wellness', description: 'Women\'s health and rights' },
  { id: 'child-health', name: 'Child Health', category: 'Health & Wellness', description: 'Children\'s health and development' },
  { id: 'addiction-recovery', name: 'Addiction Recovery', category: 'Health & Wellness', description: 'Substance abuse recovery' },
  { id: 'holistic-health', name: 'Holistic Health', category: 'Health & Wellness', description: 'Whole-person health approaches' },
  { id: 'healthcare-innovation', name: 'Healthcare Innovation', category: 'Health & Wellness', description: 'Innovative healthcare solutions' },
];

// Create simplified mission values with focused categories
export const SIMPLIFIED_MISSION_VALUES: MissionValue[] = [
  // Social Impact (key areas)
  { id: 'social-justice', name: 'Social Justice', category: 'Social Impact', description: 'Fighting inequality and promoting fairness' },
  { id: 'education-access', name: 'Education Access', category: 'Social Impact', description: 'Making quality education available to all' },
  { id: 'diversity-inclusion', name: 'Diversity & Inclusion', category: 'Social Impact', description: 'Promoting representation and belonging' },

  // Environmental (critical issues)
  { id: 'sustainability', name: 'Sustainability', category: 'Environmental', description: 'Environmental stewardship and conservation' },
  { id: 'climate-action', name: 'Climate Action', category: 'Environmental', description: 'Addressing climate change' },
  { id: 'renewable-energy', name: 'Renewable Energy', category: 'Environmental', description: 'Clean energy solutions' },
  { id: 'biodiversity', name: 'Biodiversity', category: 'Environmental', description: 'Protecting ecosystems and species' },

  // Economic (empowerment)
  { id: 'economic-empowerment', name: 'Economic Empowerment', category: 'Economic', description: 'Financial independence and opportunity' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', category: 'Economic', description: 'Supporting business creation' },
  { id: 'job-creation', name: 'Job Creation', category: 'Economic', description: 'Creating meaningful employment' },
  { id: 'financial-inclusion', name: 'Financial Inclusion', category: 'Economic', description: 'Access to financial services' },

  // Technology (for good)
  { id: 'tech-for-good', name: 'Tech for Good', category: 'Technology', description: 'Technology that benefits society' },
  { id: 'digital-inclusion', name: 'Digital Inclusion', category: 'Technology', description: 'Bridging the digital divide' },
  { id: 'ai-ethics', name: 'AI Ethics', category: 'Technology', description: 'Responsible artificial intelligence' },
  { id: 'privacy-rights', name: 'Privacy Rights', category: 'Technology', description: 'Protecting personal data' },

  // Health & Wellness (well-being)
  { id: 'mental-wellness', name: 'Mental Wellness', category: 'Health & Wellness', description: 'Mental health and emotional well-being' },
  { id: 'preventive-health', name: 'Preventive Health', category: 'Health & Wellness', description: 'Preventing illness and promoting wellness' },
  { id: 'healthcare-innovation', name: 'Healthcare Innovation', category: 'Health & Wellness', description: 'Innovative healthcare solutions' },
];

export const MISSION_VALUE_CATEGORIES = Array.from(new Set(MISSION_VALUES.map(value => value.category))).sort();

export const getMissionValuesByCategory = () => {
  const valuesByCategory: Record<string, MissionValue[]> = {};
  MISSION_VALUES.forEach(value => {
    if (!valuesByCategory[value.category]) {
      valuesByCategory[value.category] = [];
    }
    valuesByCategory[value.category].push(value);
  });
  return valuesByCategory;
};

export const getMissionValueNames = (valueIds: string[]): string[] => {
  return valueIds
    .map(id => MISSION_VALUES.find(value => value.id === id)?.name)
    .filter(Boolean) as string[];
};

export const getMissionValueIds = (valueNames: string[]): string[] => {
  return valueNames
    .map(name => MISSION_VALUES.find(value => value.name.toLowerCase() === name.toLowerCase())?.id)
    .filter(Boolean) as string[];
};

// Functions for simplified mission values
export const getSimplifiedMissionValueNames = (valueIds: string[]): string[] => {
  return valueIds
    .map(id => SIMPLIFIED_MISSION_VALUES.find(value => value.id === id)?.name)
    .filter(Boolean) as string[];
};

export const getSimplifiedMissionValueIds = (valueNames: string[]): string[] => {
  return valueNames
    .map(name => SIMPLIFIED_MISSION_VALUES.find(value => value.name.toLowerCase() === name.toLowerCase())?.id)
    .filter(Boolean) as string[];
};

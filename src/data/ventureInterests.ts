export interface VentureInterest {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const VENTURE_INTERESTS: VentureInterest[] = [
  // Stage
  { id: 'idea-stage', name: 'Idea Stage', category: 'Stage', description: 'Very early concepts and ideas' },
  { id: 'early-stage', name: 'Early Stage', category: 'Stage', description: 'Pre-seed and seed stage startups' },
  { id: 'growth-stage', name: 'Growth Stage', category: 'Stage', description: 'Series A and beyond' },
  { id: 'established', name: 'Established', category: 'Stage', description: 'Mature companies and organizations' },
  { id: 'scale-up', name: 'Scale-up', category: 'Stage', description: 'Companies ready to scale' },

  // Social Impact
  { id: 'social-impact', name: 'Social Impact', category: 'Social Impact', description: 'Creating positive social change' },
  { id: 'nonprofit', name: 'Nonprofit', category: 'Social Impact', description: 'Nonprofit organizations' },
  { id: 'b-corp', name: 'B-Corp', category: 'Social Impact', description: 'Benefit corporations' },
  { id: 'social-enterprise', name: 'Social Enterprise', category: 'Social Impact', description: 'Businesses with social missions' },
  { id: 'community-org', name: 'Community Organizations', category: 'Social Impact', description: 'Local community groups' },
  { id: 'advocacy', name: 'Advocacy', category: 'Social Impact', description: 'Policy and advocacy work' },
  { id: 'education', name: 'Education', category: 'Social Impact', description: 'Educational initiatives' },
  { id: 'healthcare', name: 'Healthcare', category: 'Social Impact', description: 'Healthcare and wellness' },
  { id: 'poverty', name: 'Poverty Alleviation', category: 'Social Impact', description: 'Addressing economic inequality' },
  { id: 'justice', name: 'Criminal Justice', category: 'Social Impact', description: 'Criminal justice reform' },



  // Technology
  { id: 'fintech', name: 'FinTech', category: 'Technology', description: 'Financial technology' },
  { id: 'healthtech', name: 'HealthTech', category: 'Technology', description: 'Healthcare technology' },
  { id: 'edtech', name: 'EdTech', category: 'Technology', description: 'Educational technology' },
  { id: 'proptech', name: 'PropTech', category: 'Technology', description: 'Property technology' },
  { id: 'insurtech', name: 'InsurTech', category: 'Technology', description: 'Insurance technology' },
  { id: 'legaltech', name: 'LegalTech', category: 'Technology', description: 'Legal technology' },
  { id: 'regtech', name: 'RegTech', category: 'Technology', description: 'Regulatory technology' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology', description: 'Digital security' },
  { id: 'ai-ml', name: 'AI/ML', category: 'Technology', description: 'Artificial intelligence and machine learning' },
  { id: 'blockchain', name: 'Blockchain', category: 'Technology', description: 'Blockchain and cryptocurrency' },
  { id: 'web3', name: 'Web3', category: 'Technology', description: 'Decentralized web technologies' },
  { id: 'iot', name: 'IoT', category: 'Technology', description: 'Internet of Things' },
  { id: 'ar-vr', name: 'AR/VR', category: 'Technology', description: 'Augmented and virtual reality' },
  { id: 'robotics', name: 'Robotics', category: 'Technology', description: 'Robotics and automation' },
  { id: 'quantum', name: 'Quantum Computing', category: 'Technology', description: 'Quantum computing' },
  { id: 'biotech', name: 'Biotech', category: 'Technology', description: 'Biotechnology' },
  { id: 'nanotech', name: 'Nanotech', category: 'Technology', description: 'Nanotechnology' },
  { id: 'space', name: 'Space Tech', category: 'Technology', description: 'Space technology' },
  { id: 'mobility', name: 'Mobility', category: 'Technology', description: 'Transportation and mobility' },
  { id: 'smart-cities', name: 'Smart Cities', category: 'Technology', description: 'Urban technology solutions' },

  // Industry
  { id: 'ecommerce', name: 'E-commerce', category: 'Industry', description: 'Online retail and commerce' },
  { id: 'marketplace', name: 'Marketplace', category: 'Industry', description: 'Platform marketplaces' },
  { id: 'saas', name: 'SaaS', category: 'Industry', description: 'Software as a Service' },
  { id: 'b2b', name: 'B2B', category: 'Industry', description: 'Business to business' },
  { id: 'b2c', name: 'B2C', category: 'Industry', description: 'Business to consumer' },
  { id: 'd2c', name: 'D2C', category: 'Industry', description: 'Direct to consumer' },
  { id: 'manufacturing', name: 'Manufacturing', category: 'Industry', description: 'Manufacturing and production' },
  { id: 'retail', name: 'Retail', category: 'Industry', description: 'Retail and consumer goods' },
  { id: 'food-beverage', name: 'Food & Beverage', category: 'Industry', description: 'Food and beverage industry' },
  { id: 'fashion', name: 'Fashion', category: 'Industry', description: 'Fashion and apparel' },
  { id: 'beauty', name: 'Beauty', category: 'Industry', description: 'Beauty and personal care' },
  { id: 'fitness', name: 'Fitness', category: 'Industry', description: 'Fitness and wellness' },
  { id: 'media', name: 'Media', category: 'Industry', description: 'Media and entertainment' },
  { id: 'gaming', name: 'Gaming', category: 'Industry', description: 'Gaming and esports' },
  { id: 'music', name: 'Music', category: 'Industry', description: 'Music industry' },
  { id: 'sports', name: 'Sports', category: 'Industry', description: 'Sports and athletics' },
  { id: 'travel', name: 'Travel', category: 'Industry', description: 'Travel and tourism' },
  { id: 'hospitality', name: 'Hospitality', category: 'Industry', description: 'Hospitality and lodging' },
  { id: 'real-estate', name: 'Real Estate', category: 'Industry', description: 'Real estate and property' },
  { id: 'construction', name: 'Construction', category: 'Industry', description: 'Construction and building' },
  { id: 'energy', name: 'Energy', category: 'Industry', description: 'Energy sector' },
  { id: 'mining', name: 'Mining', category: 'Industry', description: 'Mining and resources' },
  { id: 'logistics', name: 'Logistics', category: 'Industry', description: 'Logistics and supply chain' },
  { id: 'consulting', name: 'Consulting', category: 'Industry', description: 'Professional services and consulting' },
  { id: 'marketing', name: 'Marketing', category: 'Industry', description: 'Marketing and advertising' },
  { id: 'pr', name: 'Public Relations', category: 'Industry', description: 'Public relations and communications' },
  { id: 'events', name: 'Events', category: 'Industry', description: 'Events and experiences' },
  { id: 'publishing', name: 'Publishing', category: 'Industry', description: 'Publishing and content' },
  { id: 'research', name: 'Research', category: 'Industry', description: 'Research and development' },
  { id: 'pharma', name: 'Pharmaceuticals', category: 'Industry', description: 'Pharmaceutical industry' },
  { id: 'aerospace', name: 'Aerospace', category: 'Industry', description: 'Aerospace and defense' },
  { id: 'automotive', name: 'Automotive', category: 'Industry', description: 'Automotive industry' },
  { id: 'telecom', name: 'Telecommunications', category: 'Industry', description: 'Telecommunications' },
  { id: 'utilities', name: 'Utilities', category: 'Industry', description: 'Utility services' },
  { id: 'government', name: 'Government', category: 'Industry', description: 'Government and public sector' },
  { id: 'nonprofit-sector', name: 'Nonprofit Sector', category: 'Industry', description: 'Nonprofit organizations' },
  { id: 'academia', name: 'Academia', category: 'Industry', description: 'Academic and research institutions' },
];

export const VENTURE_INTEREST_CATEGORIES = Array.from(new Set(VENTURE_INTERESTS.map(interest => interest.category))).sort();

export const getVentureInterestsByCategory = () => {
  const interestsByCategory: Record<string, VentureInterest[]> = {};
  VENTURE_INTERESTS.forEach(interest => {
    if (!interestsByCategory[interest.category]) {
      interestsByCategory[interest.category] = [];
    }
    interestsByCategory[interest.category].push(interest);
  });
  return interestsByCategory;
};

export const getVentureInterestNames = (interestIds: string[]): string[] => {
  return interestIds
    .map(id => VENTURE_INTERESTS.find(interest => interest.id === id)?.name)
    .filter(Boolean) as string[];
};

export const getVentureInterestIds = (interestNames: string[]): string[] => {
  return interestNames
    .map(name => VENTURE_INTERESTS.find(interest => interest.name.toLowerCase() === name.toLowerCase())?.id)
    .filter(Boolean) as string[];
};

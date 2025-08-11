export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const SKILLS: Skill[] = [
  // Frontend Development
  { id: 'react', name: 'React', category: 'Frontend Development' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend Development' },
  { id: 'angular', name: 'Angular', category: 'Frontend Development' },
  { id: 'javascript', name: 'JavaScript', category: 'Frontend Development' },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend Development' },
  { id: 'html', name: 'HTML', category: 'Frontend Development' },
  { id: 'css', name: 'CSS', category: 'Frontend Development' },
  { id: 'sass', name: 'Sass/SCSS', category: 'Frontend Development' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend Development' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'Frontend Development' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend Development' },
  { id: 'nuxt', name: 'Nuxt.js', category: 'Frontend Development' },
  { id: 'gatsby', name: 'Gatsby', category: 'Frontend Development' },

  // Backend Development
  { id: 'nodejs', name: 'Node.js', category: 'Backend Development' },
  { id: 'python', name: 'Python', category: 'Backend Development' },
  { id: 'django', name: 'Django', category: 'Backend Development' },
  { id: 'flask', name: 'Flask', category: 'Backend Development' },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend Development' },
  { id: 'java', name: 'Java', category: 'Backend Development' },
  { id: 'spring', name: 'Spring Boot', category: 'Backend Development' },
  { id: 'csharp', name: 'C#', category: 'Backend Development' },
  { id: 'dotnet', name: '.NET', category: 'Backend Development' },
  { id: 'php', name: 'PHP', category: 'Backend Development' },
  { id: 'laravel', name: 'Laravel', category: 'Backend Development' },
  { id: 'ruby', name: 'Ruby', category: 'Backend Development' },
  { id: 'rails', name: 'Ruby on Rails', category: 'Backend Development' },
  { id: 'go', name: 'Go', category: 'Backend Development' },
  { id: 'rust', name: 'Rust', category: 'Backend Development' },

  // Database & Data
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database & Data' },
  { id: 'mysql', name: 'MySQL', category: 'Database & Data' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database & Data' },
  { id: 'redis', name: 'Redis', category: 'Database & Data' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'Database & Data' },
  { id: 'dynamodb', name: 'DynamoDB', category: 'Database & Data' },
  { id: 'firebase', name: 'Firebase', category: 'Database & Data' },
  { id: 'supabase', name: 'Supabase', category: 'Database & Data' },
  { id: 'sql', name: 'SQL', category: 'Database & Data' },
  { id: 'data-analysis', name: 'Data Analysis', category: 'Database & Data' },
  { id: 'machine-learning', name: 'Machine Learning', category: 'Database & Data' },
  { id: 'ai', name: 'Artificial Intelligence', category: 'Database & Data' },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'Cloud & DevOps' },
  { id: 'azure', name: 'Azure', category: 'Cloud & DevOps' },
  { id: 'gcp', name: 'Google Cloud Platform', category: 'Cloud & DevOps' },
  { id: 'docker', name: 'Docker', category: 'Cloud & DevOps' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Cloud & DevOps' },
  { id: 'terraform', name: 'Terraform', category: 'Cloud & DevOps' },
  { id: 'jenkins', name: 'Jenkins', category: 'Cloud & DevOps' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'Cloud & DevOps' },
  { id: 'gitlab-ci', name: 'GitLab CI/CD', category: 'Cloud & DevOps' },
  { id: 'linux', name: 'Linux', category: 'Cloud & DevOps' },
  { id: 'nginx', name: 'Nginx', category: 'Cloud & DevOps' },
  { id: 'serverless', name: 'Serverless', category: 'Cloud & DevOps' },

  // Mobile Development
  { id: 'react-native', name: 'React Native', category: 'Mobile Development' },
  { id: 'flutter', name: 'Flutter', category: 'Mobile Development' },
  { id: 'ios', name: 'iOS Development', category: 'Mobile Development' },
  { id: 'android', name: 'Android Development', category: 'Mobile Development' },
  { id: 'swift', name: 'Swift', category: 'Mobile Development' },
  { id: 'kotlin', name: 'Kotlin', category: 'Mobile Development' },
  { id: 'xamarin', name: 'Xamarin', category: 'Mobile Development' },

  // Design & UX
  { id: 'ui-design', name: 'UI Design', category: 'Design & UX' },
  { id: 'ux-design', name: 'UX Design', category: 'Design & UX' },
  { id: 'figma', name: 'Figma', category: 'Design & UX' },
  { id: 'sketch', name: 'Sketch', category: 'Design & UX' },
  { id: 'adobe-xd', name: 'Adobe XD', category: 'Design & UX' },
  { id: 'photoshop', name: 'Photoshop', category: 'Design & UX' },
  { id: 'illustrator', name: 'Illustrator', category: 'Design & UX' },
  { id: 'invision', name: 'InVision', category: 'Design & UX' },
  { id: 'prototyping', name: 'Prototyping', category: 'Design & UX' },
  { id: 'user-research', name: 'User Research', category: 'Design & UX' },
  { id: 'wireframing', name: 'Wireframing', category: 'Design & UX' },

  // Product & Business
  { id: 'product-management', name: 'Product Management', category: 'Product & Business' },
  { id: 'project-management', name: 'Project Management', category: 'Product & Business' },
  { id: 'agile', name: 'Agile/Scrum', category: 'Product & Business' },
  { id: 'business-strategy', name: 'Business Strategy', category: 'Product & Business' },
  { id: 'market-research', name: 'Market Research', category: 'Product & Business' },
  { id: 'user-acquisition', name: 'User Acquisition', category: 'Product & Business' },
  { id: 'growth-hacking', name: 'Growth Hacking', category: 'Product & Business' },
  { id: 'analytics', name: 'Analytics', category: 'Product & Business' },
  { id: 'a-b-testing', name: 'A/B Testing', category: 'Product & Business' },

  // Marketing & Content
  { id: 'digital-marketing', name: 'Digital Marketing', category: 'Marketing & Content' },
  { id: 'content-marketing', name: 'Content Marketing', category: 'Marketing & Content' },
  { id: 'seo', name: 'SEO', category: 'Marketing & Content' },
  { id: 'sem', name: 'SEM/PPC', category: 'Marketing & Content' },
  { id: 'social-media', name: 'Social Media Marketing', category: 'Marketing & Content' },
  { id: 'email-marketing', name: 'Email Marketing', category: 'Marketing & Content' },
  { id: 'copywriting', name: 'Copywriting', category: 'Marketing & Content' },
  { id: 'branding', name: 'Branding', category: 'Marketing & Content' },
  { id: 'video-production', name: 'Video Production', category: 'Marketing & Content' },
  { id: 'graphic-design', name: 'Graphic Design', category: 'Marketing & Content' },

  // Sales & Customer Success
  { id: 'sales', name: 'Sales', category: 'Sales & Customer Success' },
  { id: 'customer-success', name: 'Customer Success', category: 'Sales & Customer Success' },
  { id: 'account-management', name: 'Account Management', category: 'Sales & Customer Success' },
  { id: 'partnerships', name: 'Partnerships', category: 'Sales & Customer Success' },
  { id: 'business-development', name: 'Business Development', category: 'Sales & Customer Success' },

  // Finance & Operations
  { id: 'financial-modeling', name: 'Financial Modeling', category: 'Finance & Operations' },
  { id: 'accounting', name: 'Accounting', category: 'Finance & Operations' },
  { id: 'budgeting', name: 'Budgeting', category: 'Finance & Operations' },
  { id: 'operations', name: 'Operations', category: 'Finance & Operations' },
  { id: 'hr', name: 'Human Resources', category: 'Finance & Operations' },
  { id: 'legal', name: 'Legal', category: 'Finance & Operations' },

  // Specialized Skills
  { id: 'blockchain', name: 'Blockchain', category: 'Specialized Skills' },
  { id: 'cryptocurrency', name: 'Cryptocurrency', category: 'Specialized Skills' },
  { id: 'web3', name: 'Web3', category: 'Specialized Skills' },
  { id: 'cybersecurity', name: 'Cybersecurity', category: 'Specialized Skills' },
  { id: 'iot', name: 'IoT', category: 'Specialized Skills' },
  { id: 'ar-vr', name: 'AR/VR', category: 'Specialized Skills' },
  { id: 'game-development', name: 'Game Development', category: 'Specialized Skills' },
  { id: 'embedded-systems', name: 'Embedded Systems', category: 'Specialized Skills' },
  { id: 'robotics', name: 'Robotics', category: 'Specialized Skills' },
  { id: 'biotech', name: 'Biotechnology', category: 'Specialized Skills' },
  { id: 'fintech', name: 'Fintech', category: 'Specialized Skills' },
  { id: 'healthtech', name: 'Healthtech', category: 'Specialized Skills' },
  { id: 'edtech', name: 'Edtech', category: 'Specialized Skills' },
  { id: 'cleantech', name: 'Cleantech', category: 'Specialized Skills' },
];

export const SKILL_CATEGORIES = Array.from(new Set(SKILLS.map(skill => skill.category))).sort();

export const getSkillsByCategory = () => {
  const skillsByCategory: Record<string, Skill[]> = {};
  SKILLS.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });
  return skillsByCategory;
};

export const getSkillNames = (skillIds: string[]): string[] => {
  return skillIds
    .map(id => SKILLS.find(skill => skill.id === id)?.name)
    .filter(Boolean) as string[];
};

export const getSkillIds = (skillNames: string[]): string[] => {
  return skillNames
    .map(name => SKILLS.find(skill => skill.name.toLowerCase() === name.toLowerCase())?.id)
    .filter(Boolean) as string[];
};

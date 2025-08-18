import React from 'react';
import { SIMPLIFIED_SKILLS, getSimplifiedSkillNames, getSimplifiedSkillIds, Skill } from '../data/skills';

interface SkillsMultiSelectProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
  userType?: 'expert' | 'ventures' | 'both';
}

const SkillsMultiSelect: React.FC<SkillsMultiSelectProps> = ({
  selectedSkills,
  onChange,
  placeholder = "Select skill areas...",
  className = "",
  userType = 'expert'
}) => {
  const selectedSkillIds = getSimplifiedSkillIds(selectedSkills);
  const selectedSkillNames = getSimplifiedSkillNames(selectedSkillIds);

  const toggleSkill = (skillId: string) => {
    const skill = SIMPLIFIED_SKILLS.find(s => s.id === skillId);
    if (!skill) return;

    const newSelectedSkills = selectedSkillIds.includes(skillId)
      ? selectedSkillIds.filter(id => id !== skillId)
      : [...selectedSkillIds, skillId];

    const newSelectedSkillNames = getSimplifiedSkillNames(newSelectedSkills);
    onChange(newSelectedSkillNames);
  };

  const removeSkill = (skillId: string) => {
    const newSelectedSkills = selectedSkillIds.filter(id => id !== skillId);
    const newSelectedSkillNames = getSimplifiedSkillNames(newSelectedSkills);
    onChange(newSelectedSkillNames);
  };

  const clearAll = () => {
    onChange([]);
  };



  // Contextual labels based on user type
  const isVenture = userType === 'ventures';
  const selectedLabel = isVenture ? 'Skills Needed' : 'Skills I Have';
  const emptyStateText = isVenture 
    ? "What skills do you need help with for your venture?"
    : "What skills can you offer to help ventures?";

  return (
    <div className={`${className}`}>
      {/* Selected Skills Display */}
      {selectedSkillNames.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-teal-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedLabel} ({selectedSkillNames.length})
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSkillNames.map((skillName, index) => {
              const skill = SIMPLIFIED_SKILLS.find(s => s.name === skillName);
              return (
                <span
                  key={skill?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-300 shadow-sm"
                >
                  {skillName}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill?.id || '')}
                    className="text-gray-500 hover:text-red-600 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="skills-grid">
        <div className="skills-category">
          <div className="skill-tags">
            {SIMPLIFIED_SKILLS.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`skill-tag ${
                  selectedSkillIds.includes(skill.id) ? 'selected' : ''
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {selectedSkillNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔧</div>
          <p className="text-sm">{placeholder}</p>
        </div>
      )}
    </div>
  );
};

export default SkillsMultiSelect;

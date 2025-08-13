import React from 'react';
import { SKILLS, SKILL_CATEGORIES, getSkillsByCategory, getSkillNames, getSkillIds, Skill } from '../data/skills';

interface SkillsMultiSelectProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
}

const SkillsMultiSelect: React.FC<SkillsMultiSelectProps> = ({
  selectedSkills,
  onChange,
  placeholder = "Select skills...",
  className = ""
}) => {
  const skillsByCategory = getSkillsByCategory();
  const selectedSkillIds = getSkillIds(selectedSkills);
  const selectedSkillNames = getSkillNames(selectedSkillIds);

  const toggleSkill = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return;

    const newSelectedSkills = selectedSkillIds.includes(skillId)
      ? selectedSkillIds.filter(id => id !== skillId)
      : [...selectedSkillIds, skillId];

    const newSelectedSkillNames = getSkillNames(newSelectedSkills);
    onChange(newSelectedSkillNames);
  };

  const removeSkill = (skillId: string) => {
    const newSelectedSkills = selectedSkillIds.filter(id => id !== skillId);
    const newSelectedSkillNames = getSkillNames(newSelectedSkills);
    onChange(newSelectedSkillNames);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`${className}`}>
      {/* Selected Skills Display */}
      {selectedSkillNames.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-teal-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Skills ({selectedSkillNames.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSkillNames.map((skillName, index) => {
              const skill = SKILLS.find(s => s.name === skillName);
              return (
                <span
                  key={skill?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-300 shadow-sm"
                >
                  {skillName}
                  <button
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

      {/* Skills Grid by Category */}
      <div className="skills-grid">
        {SKILL_CATEGORIES.map(category => {
          const categorySkills = skillsByCategory[category] || [];
          if (categorySkills.length === 0) return null;

          return (
            <div key={category} className="skills-category">
              <h4>{category}</h4>
              <div className="skill-tags">
                {categorySkills.map(skill => (
                  <button
                    key={skill.id}
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
          );
        })}
      </div>

      {/* Empty State */}
      {selectedSkillNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔧</div>
          <p className="text-sm">{placeholder}</p>
          <p className="text-xs mt-1">Click on skills below to select them</p>
        </div>
      )}
    </div>
  );
};

export default SkillsMultiSelect;

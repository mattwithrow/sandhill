import React, { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skillsByCategory = getSkillsByCategory();
  const selectedSkillIds = getSkillIds(selectedSkills);
  const selectedSkillNames = getSkillNames(selectedSkillIds);

  // Filter skills based on search term and selected category
  const filteredSkills = SKILLS.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Skills Display */}
      <div 
        className="min-h-[48px] p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-orange-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedSkillNames.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSkillNames.map((skillName, index) => {
              const skill = SKILLS.find(s => s.name === skillName);
              return (
                <span
                  key={skill?.id || index}
                  className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium border border-orange-200"
                >
                  {skillName}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSkill(skill?.id || '');
                    }}
                    className="text-gray-500 hover:text-gray-700 ml-1"
                  >
                    ×
                  </button>
                </span>
              );
            })}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search and Category Filter */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            
            {/* Category Filter */}
            <div className="mt-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                {SKILL_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredSkills.length > 0 ? (
              filteredSkills.map(skill => (
                <div
                  key={skill.id}
                  className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                    selectedSkillIds.includes(skill.id) ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => toggleSkill(skill.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkillIds.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                    className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{skill.name}</div>
                    <div className="text-sm text-gray-500">{skill.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No skills found matching your search.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{selectedSkillNames.length} skill{selectedSkillNames.length !== 1 ? 's' : ''} selected</span>
              {selectedSkillNames.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-orange-600 hover:text-orange-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsMultiSelect;

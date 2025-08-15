import React from 'react';
import { VENTURE_INTERESTS, VENTURE_INTEREST_CATEGORIES, getVentureInterestsByCategory, getVentureInterestNames, getVentureInterestIds } from '../data/ventureInterests';

interface VentureInterestsMultiSelectProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  placeholder?: string;
  className?: string;
}

const VentureInterestsMultiSelect: React.FC<VentureInterestsMultiSelectProps> = ({
  selectedInterests,
  onChange,
  placeholder = "Select venture interests...",
  className = ""
}) => {
  const interestsByCategory = getVentureInterestsByCategory();
  const selectedInterestIds = getVentureInterestIds(selectedInterests);
  const selectedInterestNames = getVentureInterestNames(selectedInterestIds);

  const toggleInterest = (interestId: string) => {
    const interest = VENTURE_INTERESTS.find(i => i.id === interestId);
    if (!interest) return;

    const newSelectedInterests = selectedInterestIds.includes(interestId)
      ? selectedInterestIds.filter(id => id !== interestId)
      : [...selectedInterestIds, interestId];

    const newSelectedInterestNames = getVentureInterestNames(newSelectedInterests);
    onChange(newSelectedInterestNames);
  };

  const removeInterest = (interestId: string) => {
    const newSelectedInterests = selectedInterestIds.filter(id => id !== interestId);
    const newSelectedInterestNames = getVentureInterestNames(newSelectedInterests);
    onChange(newSelectedInterestNames);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`${className}`}>
      {/* Selected Interests Display */}
      {selectedInterestNames.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Interests ({selectedInterestNames.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedInterestNames.map((interestName, index) => {
              const interest = VENTURE_INTERESTS.find(i => i.name === interestName);
              return (
                <span
                  key={interest?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-300 shadow-sm"
                >
                  {interestName}
                  <button
                    onClick={() => removeInterest(interest?.id || '')}
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

      {/* Interests Grid by Category */}
      <div className="skills-grid">
        {VENTURE_INTEREST_CATEGORIES.map(category => {
          const categoryInterests = interestsByCategory[category] || [];
          if (categoryInterests.length === 0) return null;

          return (
            <div key={category} className="skills-category">
              <h4>{category}</h4>
              <div className="skill-tags">
                {categoryInterests.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`skill-tag ${
                      selectedInterestIds.includes(interest.id) ? 'selected' : ''
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {selectedInterestNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🚀</div>
          <p className="text-sm">{placeholder}</p>
          <p className="text-xs mt-1">Click on interests below to select them</p>
        </div>
      )}
    </div>
  );
};

export default VentureInterestsMultiSelect;

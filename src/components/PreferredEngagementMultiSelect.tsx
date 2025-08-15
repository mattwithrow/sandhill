import React from 'react';
import { ENGAGEMENT_TYPES, ENGAGEMENT_CATEGORIES, getEngagementTypesByCategory, getEngagementTypeNames, getEngagementTypeIds } from '../data/engagementTypes';

interface PreferredEngagementMultiSelectProps {
  selectedEngagements: string[];
  onChange: (engagements: string[]) => void;
  placeholder?: string;
  className?: string;
}

const PreferredEngagementMultiSelect: React.FC<PreferredEngagementMultiSelectProps> = ({
  selectedEngagements,
  onChange,
  placeholder = "Select preferred engagement types...",
  className = ""
}) => {
  const engagementsByCategory = getEngagementTypesByCategory();
  const selectedEngagementIds = getEngagementTypeIds(selectedEngagements);
  const selectedEngagementNames = getEngagementTypeNames(selectedEngagementIds);

  const toggleEngagement = (engagementId: string) => {
    const engagement = ENGAGEMENT_TYPES.find(e => e.id === engagementId);
    if (!engagement) return;

    const newSelectedEngagements = selectedEngagementIds.includes(engagementId)
      ? selectedEngagementIds.filter(id => id !== engagementId)
      : [...selectedEngagementIds, engagementId];

    const newSelectedEngagementNames = getEngagementTypeNames(newSelectedEngagements);
    onChange(newSelectedEngagementNames);
  };

  const removeEngagement = (engagementId: string) => {
    const newSelectedEngagements = selectedEngagementIds.filter(id => id !== engagementId);
    const newSelectedEngagementNames = getEngagementTypeNames(newSelectedEngagements);
    onChange(newSelectedEngagementNames);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`${className}`}>
      {/* Selected Engagements Display */}
      {selectedEngagementNames.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Engagement Types ({selectedEngagementNames.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedEngagementNames.map((engagementName, index) => {
              const engagement = ENGAGEMENT_TYPES.find(e => e.name === engagementName);
              return (
                <span
                  key={engagement?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-green-300 shadow-sm"
                >
                  {engagementName}
                  <button
                    onClick={() => removeEngagement(engagement?.id || '')}
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

      {/* Engagements Grid by Category */}
      <div className="skills-grid">
        {ENGAGEMENT_CATEGORIES.map(category => {
          const categoryEngagements = engagementsByCategory[category] || [];
          if (categoryEngagements.length === 0) return null;

          return (
            <div key={category} className="skills-category">
              <h4>{category}</h4>
              <div className="skill-tags">
                {categoryEngagements.map(engagement => (
                  <button
                    key={engagement.id}
                    onClick={() => toggleEngagement(engagement.id)}
                    className={`skill-tag ${
                      selectedEngagementIds.includes(engagement.id) ? 'selected' : ''
                    }`}
                  >
                    {engagement.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {selectedEngagementNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🤝</div>
          <p className="text-sm">{placeholder}</p>
          <p className="text-xs mt-1">Click on engagement types below to select them</p>
        </div>
      )}
    </div>
  );
};

export default PreferredEngagementMultiSelect;

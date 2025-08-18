import React from 'react';
import { SIMPLIFIED_ENGAGEMENT_TYPES, getSimplifiedEngagementTypeNames, getSimplifiedEngagementTypeIds, EngagementType } from '../data/engagementTypes';

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
  const selectedEngagementIds = getSimplifiedEngagementTypeIds(selectedEngagements);
  const selectedEngagementNames = getSimplifiedEngagementTypeNames(selectedEngagementIds);

  const toggleEngagement = (engagementId: string) => {
    const engagement = SIMPLIFIED_ENGAGEMENT_TYPES.find(e => e.id === engagementId);
    if (!engagement) return;

    const newSelectedEngagements = selectedEngagementIds.includes(engagementId)
      ? selectedEngagementIds.filter(id => id !== engagementId)
      : [...selectedEngagementIds, engagementId];

    const newSelectedEngagementNames = getSimplifiedEngagementTypeNames(newSelectedEngagements);
    onChange(newSelectedEngagementNames);
  };

  const removeEngagement = (engagementId: string) => {
    const newSelectedEngagements = selectedEngagementIds.filter(id => id !== engagementId);
    const newSelectedEngagementNames = getSimplifiedEngagementTypeNames(newSelectedEngagements);
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
              type="button"
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedEngagementNames.map((engagementName, index) => {
              const engagement = SIMPLIFIED_ENGAGEMENT_TYPES.find(e => e.name === engagementName);
              return (
                <span
                  key={engagement?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-green-300 shadow-sm"
                >
                  {engagementName}
                  <button
                    type="button"
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

      {/* Engagements Grid */}
      <div className="skills-grid">
        <div className="skills-category">
          <div className="skill-tags">
            {SIMPLIFIED_ENGAGEMENT_TYPES.map(engagement => (
              <button
                key={engagement.id}
                type="button"
                onClick={() => toggleEngagement(engagement.id)}
                className={`skill-tag ${
                  selectedEngagementIds.includes(engagement.id) ? 'selected' : ''
                }`}
                title={engagement.description}
              >
                {engagement.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {selectedEngagementNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🤝</div>
          <p className="text-sm">{placeholder}</p>
        </div>
      )}
    </div>
  );
};

export default PreferredEngagementMultiSelect;

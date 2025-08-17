import React from 'react';
import { SIMPLIFIED_MISSION_VALUES, getSimplifiedMissionValueNames, getSimplifiedMissionValueIds } from '../data/missionValues';

interface MissionValuesMultiSelectProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MissionValuesMultiSelect: React.FC<MissionValuesMultiSelectProps> = ({
  selectedValues,
  onChange,
  placeholder = "Select mission and values...",
  className = ""
}) => {
  const selectedValueIds = getSimplifiedMissionValueIds(selectedValues);
  const selectedValueNames = getSimplifiedMissionValueNames(selectedValueIds);

  const toggleValue = (valueId: string) => {
    const value = SIMPLIFIED_MISSION_VALUES.find(v => v.id === valueId);
    if (!value) return;

    const newSelectedValues = selectedValueIds.includes(valueId)
      ? selectedValueIds.filter(id => id !== valueId)
      : [...selectedValueIds, valueId];

    const newSelectedValueNames = getSimplifiedMissionValueNames(newSelectedValues);
    onChange(newSelectedValueNames);
  };

  const removeValue = (valueId: string) => {
    const newSelectedValues = selectedValueIds.filter(id => id !== valueId);
    const newSelectedValueNames = getSimplifiedMissionValueNames(newSelectedValues);
    onChange(newSelectedValueNames);
  };

  const clearAll = () => {
    onChange([]);
  };

  // Group values by category
  const valuesByCategory = SIMPLIFIED_MISSION_VALUES.reduce((acc, value) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push(value);
    return acc;
  }, {} as Record<string, typeof SIMPLIFIED_MISSION_VALUES>);

  const categories = Object.keys(valuesByCategory).sort();

  return (
    <div className={`${className}`}>
      {/* Selected Values Display */}
      {selectedValueNames.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-teal-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Values ({selectedValueNames.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedValueNames.map((valueName, index) => {
              const value = SIMPLIFIED_MISSION_VALUES.find(v => v.name === valueName);
              return (
                <span
                  key={value?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-300 shadow-sm"
                >
                  {valueName}
                  <button
                    onClick={() => removeValue(value?.id || '')}
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

      {/* Values Grid by Category */}
      <div className="skills-grid">
        {categories.map(category => {
          const categoryValues = valuesByCategory[category] || [];
          if (categoryValues.length === 0) return null;

          return (
            <div key={category} className="skills-category">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">{category}</h4>
              <div className="skill-tags">
                {categoryValues.map(value => (
                  <button
                    key={value.id}
                    onClick={() => toggleValue(value.id)}
                    className={`skill-tag ${
                      selectedValueIds.includes(value.id) ? 'selected' : ''
                    }`}
                    title={value.description}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {selectedValueNames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm">{placeholder}</p>
          <p className="text-xs mt-1">Click on values below to select them</p>
        </div>
      )}
    </div>
  );
};

export default MissionValuesMultiSelect;

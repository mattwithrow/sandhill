import React from 'react';
import { SIMPLIFIED_MISSION_VALUES, MissionValue } from '../data/missionValues';

interface ValuesMultiSelectProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  userType?: string;
}

const ValuesMultiSelect: React.FC<ValuesMultiSelectProps> = ({
  selectedValues,
  onChange,
  placeholder = "Select your values...",
  className = "",
  userType
}) => {
  const toggleValue = (valueId: string) => {
    console.log('💎 ValuesMultiSelect toggleValue called with:', valueId);
    const newSelectedValues = selectedValues.includes(valueId)
      ? selectedValues.filter(id => id !== valueId)
      : [...selectedValues, valueId];
    console.log('💎 ValuesMultiSelect calling onChange with:', newSelectedValues);
    onChange(newSelectedValues);
  };

  const removeValue = (valueId: string) => {
    const newSelectedValues = selectedValues.filter(id => id !== valueId);
    onChange(newSelectedValues);
  };

  const clearAll = () => {
    onChange([]);
  };

  const getSelectedValueNames = () => {
    return selectedValues.map(id => 
      SIMPLIFIED_MISSION_VALUES.find(v => v.id === id)?.name || id
    );
  };

  // Group values by category for better organization
  const groupedValues = SIMPLIFIED_MISSION_VALUES.reduce((acc, value) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push(value);
    return acc;
  }, {} as Record<string, MissionValue[]>);

  return (
    <div className={`${className}`}>
      {/* Selected Values Display */}
      {getSelectedValueNames().length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-teal-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Values ({getSelectedValueNames().length})
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
            {getSelectedValueNames().map((valueName, index) => {
              const value = SIMPLIFIED_MISSION_VALUES.find(v => v.name === valueName);
              return (
                <span
                  key={value?.id || index}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-300 shadow-sm"
                >
                  {valueName}
                  <button
                    type="button"
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

      {/* Values Grid */}
      <div className="skills-grid">
        {Object.entries(groupedValues).map(([category, values]) => (
          <div key={category} className="skills-category">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{category}</h4>
            <div className="skill-tags">
              {values.map(value => (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => toggleValue(value.id)}
                  className={`skill-tag ${
                    selectedValues.includes(value.id) ? 'selected' : ''
                  }`}
                  title={value.description}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getSelectedValueNames().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">💎</div>
          <p className="text-sm">{placeholder}</p>
        </div>
      )}
    </div>
  );
};

export default ValuesMultiSelect;

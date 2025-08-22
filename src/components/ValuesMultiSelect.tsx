import React, { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group values by category for better organization
  const groupedValues = SIMPLIFIED_MISSION_VALUES.reduce((acc, value) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push(value);
    return acc;
  }, {} as Record<string, MissionValue[]>);

  // Filter values based on search term
  const filteredGroupedValues = Object.entries(groupedValues).reduce((acc, [category, values]) => {
    const filteredValues = values.filter(value =>
      value.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      value.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredValues.length > 0) {
      acc[category] = filteredValues;
    }
    return acc;
  }, {} as Record<string, MissionValue[]>);

  const handleToggleValue = (valueId: string) => {
    const newSelectedValues = selectedValues.includes(valueId)
      ? selectedValues.filter(id => id !== valueId)
      : [...selectedValues, valueId];
    onChange(newSelectedValues);
  };

  const handleRemoveValue = (valueId: string) => {
    const newSelectedValues = selectedValues.filter(id => id !== valueId);
    onChange(newSelectedValues);
  };

  const getSelectedValueNames = () => {
    return selectedValues.map(id => 
      SIMPLIFIED_MISSION_VALUES.find(v => v.id === id)?.name || id
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`values-multi-select ${className}`} ref={dropdownRef}>
      {/* Selected Values Display */}
      <div className="selected-values-container">
        {getSelectedValueNames().map((valueName, index) => (
          <span
            key={index}
            className="selected-value-tag"
            onClick={() => handleRemoveValue(selectedValues[index])}
          >
            {valueName}
            <span className="remove-icon">×</span>
          </span>
        ))}
      </div>

      {/* Dropdown Trigger */}
      <div
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="search-input"
        />
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="dropdown-options">
          {Object.entries(filteredGroupedValues).map(([category, values]) => (
            <div key={category} className="value-category">
              <div className="category-header">{category}</div>
              <div className="category-values">
                {values.map((value) => (
                  <div
                    key={value.id}
                    className={`value-option ${selectedValues.includes(value.id) ? 'selected' : ''}`}
                    onClick={() => handleToggleValue(value.id)}
                  >
                    <div className="value-name">{value.name}</div>
                    <div className="value-description">{value.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(filteredGroupedValues).length === 0 && (
            <div className="no-results">No values found matching "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValuesMultiSelect;

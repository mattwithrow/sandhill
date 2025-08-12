import React, { useState, useRef, useEffect } from 'react';
import { MISSION_VALUES, MISSION_VALUE_CATEGORIES, getMissionValuesByCategory } from '../data/missionValues';

interface MissionValuesMultiSelectProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MissionValuesMultiSelect: React.FC<MissionValuesMultiSelectProps> = ({
  selectedValues,
  onChange,
  placeholder = "Select mission and values..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const valuesByCategory = getMissionValuesByCategory();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleValue = (valueId: string) => {
    const newSelectedValues = selectedValues.includes(valueId)
      ? selectedValues.filter(id => id !== valueId)
      : [...selectedValues, valueId];
    onChange(newSelectedValues);
  };

  const handleRemoveValue = (valueId: string) => {
    onChange(selectedValues.filter(id => id !== valueId));
  };

  const clearAll = () => {
    onChange([]);
  };

  const filteredValues = MISSION_VALUES.filter(value => {
    const matchesSearch = value.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         value.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || value.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedValueNames = selectedValues.map(id => 
    MISSION_VALUES.find(value => value.id === id)?.name
  ).filter(Boolean);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected values display */}
      <div className="min-h-[48px] p-3 border border-gray-300 rounded-lg bg-white">
        {selectedValueNames.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedValueNames.map((name, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-orange-100 to-teal-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-orange-200 flex items-center gap-2"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleRemoveValue(selectedValues[index])}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>

      {/* Dropdown toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {isOpen ? '▲' : '▼'}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search and category filter */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Categories</option>
              {MISSION_VALUE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Values list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredValues.length > 0 ? (
              filteredValues.map(value => (
                <div
                  key={value.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => handleToggleValue(value.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(value.id)}
                    onChange={() => {}}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{value.name}</div>
                    <div className="text-sm text-gray-500">{value.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{value.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                No values found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionValuesMultiSelect;

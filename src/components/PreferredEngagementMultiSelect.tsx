import React, { useState, useRef, useEffect } from 'react';
import { ENGAGEMENT_TYPES, ENGAGEMENT_CATEGORIES, getEngagementTypesByCategory } from '../data/engagementTypes';

interface PreferredEngagementMultiSelectProps {
  selectedEngagements: string[];
  onChange: (engagements: string[]) => void;
  placeholder?: string;
}

const PreferredEngagementMultiSelect: React.FC<PreferredEngagementMultiSelectProps> = ({
  selectedEngagements,
  onChange,
  placeholder = "Select preferred engagement types..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const engagementsByCategory = getEngagementTypesByCategory();

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

  const handleToggleEngagement = (engagementId: string) => {
    const newSelectedEngagements = selectedEngagements.includes(engagementId)
      ? selectedEngagements.filter(id => id !== engagementId)
      : [...selectedEngagements, engagementId];
    onChange(newSelectedEngagements);
  };

  const handleRemoveEngagement = (engagementId: string) => {
    onChange(selectedEngagements.filter(id => id !== engagementId));
  };

  const clearAll = () => {
    onChange([]);
  };

  const filteredEngagements = ENGAGEMENT_TYPES.filter(engagement => {
    const matchesSearch = engagement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engagement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || engagement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedEngagementNames = selectedEngagements.map(id => 
    ENGAGEMENT_TYPES.find(engagement => engagement.id === id)?.name
  ).filter(Boolean);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected engagements display */}
      <div className="min-h-[48px] p-3 border border-gray-300 rounded-lg bg-white">
        {selectedEngagementNames.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedEngagementNames.map((name, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleRemoveEngagement(selectedEngagements[index])}
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
              placeholder="Search engagement types..."
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
              {ENGAGEMENT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Engagements list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredEngagements.length > 0 ? (
              filteredEngagements.map(engagement => (
                <div
                  key={engagement.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => handleToggleEngagement(engagement.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedEngagements.includes(engagement.id)}
                    onChange={() => {}}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{engagement.name}</div>
                    <div className="text-sm text-gray-500">{engagement.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{engagement.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                No engagement types found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferredEngagementMultiSelect;

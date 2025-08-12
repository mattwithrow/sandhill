import React, { useState, useRef, useEffect } from 'react';
import { VENTURE_INTERESTS, VENTURE_INTEREST_CATEGORIES, getVentureInterestsByCategory } from '../data/ventureInterests';

interface VentureInterestsMultiSelectProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  placeholder?: string;
}

const VentureInterestsMultiSelect: React.FC<VentureInterestsMultiSelectProps> = ({
  selectedInterests,
  onChange,
  placeholder = "Select venture interests..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const interestsByCategory = getVentureInterestsByCategory();

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

  const handleToggleInterest = (interestId: string) => {
    const newSelectedInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    onChange(newSelectedInterests);
  };

  const handleRemoveInterest = (interestId: string) => {
    onChange(selectedInterests.filter(id => id !== interestId));
  };

  const clearAll = () => {
    onChange([]);
  };

  const filteredInterests = VENTURE_INTERESTS.filter(interest => {
    const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || interest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedInterestNames = selectedInterests.map(id => 
    VENTURE_INTERESTS.find(interest => interest.id === id)?.name
  ).filter(Boolean);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected interests display */}
      <div className="min-h-[48px] p-3 border border-gray-300 rounded-lg bg-white">
        {selectedInterestNames.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedInterestNames.map((name, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 flex items-center gap-2"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(selectedInterests[index])}
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
              placeholder="Search interests..."
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
              {VENTURE_INTEREST_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Interests list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredInterests.length > 0 ? (
              filteredInterests.map(interest => (
                <div
                  key={interest.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => handleToggleInterest(interest.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.id)}
                    onChange={() => {}}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{interest.name}</div>
                    <div className="text-sm text-gray-500">{interest.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{interest.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                No interests found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VentureInterestsMultiSelect;

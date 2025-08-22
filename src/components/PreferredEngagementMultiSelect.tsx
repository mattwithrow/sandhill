import React, { useState, useRef, useEffect } from 'react';
import { ENGAGEMENT_TYPES, EngagementType } from '../data/engagementTypes';

interface PreferredEngagementMultiSelectProps {
  selectedEngagements: string[];
  onChange: (engagements: string[]) => void;
  placeholder?: string;
  className?: string;
  userType?: string;
}

const PreferredEngagementMultiSelect: React.FC<PreferredEngagementMultiSelectProps> = ({
  selectedEngagements,
  onChange,
  placeholder = "Select how you want to engage...",
  className = "",
  userType
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group engagement types by category for better organization
  const groupedEngagements = ENGAGEMENT_TYPES.reduce((acc, engagement) => {
    if (!acc[engagement.category]) {
      acc[engagement.category] = [];
    }
    acc[engagement.category].push(engagement);
    return acc;
  }, {} as Record<string, EngagementType[]>);

  // Filter engagements based on search term
  const filteredGroupedEngagements = Object.entries(groupedEngagements).reduce((acc, [category, engagements]) => {
    const filteredEngagements = engagements.filter(engagement =>
      engagement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engagement.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredEngagements.length > 0) {
      acc[category] = filteredEngagements;
    }
    return acc;
  }, {} as Record<string, EngagementType[]>);

  const handleToggleEngagement = (engagementId: string) => {
    const newSelectedEngagements = selectedEngagements.includes(engagementId)
      ? selectedEngagements.filter(id => id !== engagementId)
      : [...selectedEngagements, engagementId];
    onChange(newSelectedEngagements);
  };

  const handleRemoveEngagement = (engagementId: string) => {
    const newSelectedEngagements = selectedEngagements.filter(id => id !== engagementId);
    onChange(newSelectedEngagements);
  };

  const getSelectedEngagementNames = () => {
    return selectedEngagements.map(id => 
      ENGAGEMENT_TYPES.find(e => e.id === id)?.name || id
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
    <div className={`preferred-engagement-multi-select ${className}`} ref={dropdownRef}>
      {/* Selected Engagements Display */}
      <div className="selected-engagements-container">
        {getSelectedEngagementNames().map((engagementName, index) => (
          <span
            key={index}
            className="selected-engagement-tag"
            onClick={() => handleRemoveEngagement(selectedEngagements[index])}
          >
            {engagementName}
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
          {Object.entries(filteredGroupedEngagements).map(([category, engagements]) => (
            <div key={category} className="engagement-category">
              <div className="category-header">{category}</div>
              <div className="category-engagements">
                {engagements.map((engagement) => (
                  <div
                    key={engagement.id}
                    className={`engagement-option ${selectedEngagements.includes(engagement.id) ? 'selected' : ''}`}
                    onClick={() => handleToggleEngagement(engagement.id)}
                  >
                    <div className="engagement-name">{engagement.name}</div>
                    <div className="engagement-description">{engagement.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(filteredGroupedEngagements).length === 0 && (
            <div className="no-results">No engagement types found matching "{searchTerm}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreferredEngagementMultiSelect;

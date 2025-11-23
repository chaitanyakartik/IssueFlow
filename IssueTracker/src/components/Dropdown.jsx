import { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({ label, options, value, onChange, multiSelect = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (optionValue) => {
    if (multiSelect) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };
  
  const getDisplayText = () => {
    if (multiSelect) {
      if (value.length === 0) return label;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option ? option.label : label;
      }
      return `${label} (${value.length})`;
    }
    
    if (!value) return label;
    const option = options.find(opt => opt.value === value);
    return option ? option.label : label;
  };
  
  const hasSelection = multiSelect ? value.length > 0 : value !== null && value !== '';
  
  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className={`dropdown-toggle ${hasSelection ? 'has-selection' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getDisplayText()}
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {!multiSelect && value && (
            <div 
              className="dropdown-item clear-option"
              onClick={() => handleSelect(null)}
            >
              Clear filter
            </div>
          )}
          {multiSelect && value.length > 0 && (
            <div 
              className="dropdown-item clear-option"
              onClick={() => onChange([])}
            >
              Clear all
            </div>
          )}
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-item ${
                multiSelect 
                  ? (value.includes(option.value) ? 'selected' : '')
                  : (value === option.value ? 'selected' : '')
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {multiSelect && (
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => {}}
                  className="dropdown-checkbox"
                />
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

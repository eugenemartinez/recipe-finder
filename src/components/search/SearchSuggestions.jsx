import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

const SearchSuggestions = ({ 
  suggestions, 
  selectedIndex, 
  handleSuggestionClick,
  hasHistory
}) => {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mb-2">
      {hasHistory && (
        <div className="px-3 pb-1 mb-1 border-b border-[#3D405B]">
          <h3 className="text-[#F4F1DE] text-xs font-medium">Suggestions</h3>
        </div>
      )}
      <div>
        {suggestions.map((suggestion, index) => (
          <div 
            key={`sugg-${index}`}
            className={`flex items-center px-3 py-2 cursor-pointer ${
              selectedIndex === index ? 'bg-[#3D405B]' : 'hover:bg-[#3D405B]'
            }`}
            onClick={() => handleSuggestionClick(suggestion)}
            role="option"
            aria-selected={selectedIndex === index}
          >
            <FaArrowUp className="mr-2 text-[#81B29A] rotate-45" size={10} />
            <span className="text-[#F4F1DE] text-sm">{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
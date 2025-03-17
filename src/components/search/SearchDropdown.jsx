import React from 'react';
import { FaHistory, FaTrash, FaArrowUp } from 'react-icons/fa';

const SearchDropdown = ({ 
  dropdownRef, 
  suggestions, 
  searchHistory, 
  searchTerm, 
  selectedIndex,
  onSuggestionClick,
  onHistoryItemClick,
  onClearHistoryItem,
  onClearAllHistory 
}) => {
  if (!(searchHistory.length > 0 || suggestions.length > 0)) {
    return null;
  }
  
  return (
    <div 
      id="search-dropdown"
      role="listbox"
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 py-2 bg-[#2D2A32] rounded-md shadow-lg z-10 border border-[#3D405B] max-h-60 overflow-y-auto no-scrollbar"
      onTouchStart={(e) => e.stopPropagation()} // Prevent body scroll on mobile
    >
      {/* Suggestions section */}
      {suggestions.length > 0 && (
        <div className="mb-2">
          {searchHistory.length > 0 && (
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
                onClick={() => onSuggestionClick(suggestion)}
                role="option"
                aria-selected={selectedIndex === index}
              >
                <FaArrowUp className="mr-2 text-[#81B29A] rotate-45" size={10} />
                <span className="text-[#F4F1DE] text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Handle empty state or errors when getting suggestions */}
      {suggestions.length === 0 && searchTerm.trim().length >= 2 && (
        <div className="px-3 py-2 text-[#F4F1DE] text-sm opacity-70">
          No suggestions found
        </div>
      )}

      {/* Search history section */}
      {searchHistory.length > 0 && (
        <>
          <div className="flex items-center justify-between px-3 pb-1 mb-1 border-b border-[#3D405B]">
            <h3 className="text-[#F4F1DE] flex items-center text-xs font-medium">
              <FaHistory className="mr-2" size={12} /> Recent Searches
            </h3>
            <button
              onClick={onClearAllHistory}
              className="text-[#E07A5F] hover:text-[#D06A4F] text-xs flex items-center cursor-pointer"
            >
              <FaTrash className="mr-1" size={10} /> Clear All
            </button>
          </div>
          
          <div>
            {searchHistory.map((term, index) => {
              const itemIndex = index + suggestions.length;
              return (
                <div 
                  key={`hist-${index}`}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                    selectedIndex === itemIndex ? 'bg-[#3D405B]' : 'hover:bg-[#3D405B]'
                  }`}
                  onClick={() => onHistoryItemClick(term)}
                  role="option"
                  aria-selected={selectedIndex === itemIndex}
                >
                  <div className="flex items-center text-[#F4F1DE] text-sm">
                    <FaHistory size={10} className="mr-2 text-[#81B29A]" />
                    {term}
                  </div>
                  <button
                    onClick={(e) => onClearHistoryItem(e, term)}
                    className="text-[#E07A5F] hover:text-[#D06A4F] text-xs cursor-pointer"
                    aria-label="Remove from history"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
import React from 'react';
import { FaHistory, FaTrash } from 'react-icons/fa';

const SearchHistory = ({
  searchHistory,
  handleHistoryItemClick,
  handleClearHistoryItem,
  handleClearAllHistory,
  selectedIndex,
  suggestionCount
}) => {
  if (searchHistory.length === 0) return null;
  
  return (
    <>
      <div className="flex items-center justify-between px-3 pb-1 mb-1 border-b border-[#3D405B]">
        <h3 className="text-[#F4F1DE] flex items-center text-xs font-medium">
          <FaHistory className="mr-2" size={12} /> Recent Searches
        </h3>
        <button
          onClick={handleClearAllHistory}
          className="text-[#E07A5F] hover:text-[#D06A4F] text-xs flex items-center"
        >
          <FaTrash className="mr-1" size={10} /> Clear All
        </button>
      </div>
      
      <div>
        {searchHistory.map((term, index) => {
          const itemIndex = index + suggestionCount;
          return (
            <div 
              key={`hist-${index}`}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                selectedIndex === itemIndex ? 'bg-[#3D405B]' : 'hover:bg-[#3D405B]'
              }`}
              onClick={() => handleHistoryItemClick(term)}
              role="option"
              aria-selected={selectedIndex === itemIndex}
            >
              <div className="flex items-center text-[#F4F1DE] text-sm">
                <FaHistory size={10} className="mr-2 text-[#81B29A]" />
                {term}
              </div>
              <button
                onClick={(e) => handleClearHistoryItem(e, term)}
                className="text-[#E07A5F] hover:text-[#D06A4F] text-xs"
                aria-label="Remove from history"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchHistory;
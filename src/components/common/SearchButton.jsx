import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable SearchButton component
 * @param {Function} onClick - Custom click handler (optional)
 * @param {string} searchTerm - Search term to use for navigation
 * @param {boolean} isCompact - If true, shows smaller version
 * @param {boolean} showText - If true, shows "Search" text (responsive by default)
 * @param {boolean} inSearchBar - If true, uses styling appropriate for search bar integration
 * @param {string} className - Additional CSS classes
 * @param {string} type - Button type (submit or button)
 */
const SearchButton = ({
  onClick,
  searchTerm = '',
  isCompact = false,
  showText = false,
  inSearchBar = false,
  className = "",
  type = "button" // Can be "submit" when used in forms
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    if (type === "submit") return; // Let the form handle submission
    
    if (onClick) {
      onClick(e);
      return;
    }
    
    // Default: navigate to search results with the current search term
    if (searchTerm) {
      navigate('/', {
        state: {
          showHero: false,
          preserveSearch: true,
          searchTerm
        }
      });
    }
  };

  // Different hover effects based on context
  const hoverEffects = inSearchBar 
    ? "hover:bg-[#6A967F]" 
    : "hover:bg-[#6A967F] hover:-translate-y-0.5 hover:shadow-md";
  
  // Different active effects based on context
  const activeEffects = inSearchBar
    ? "active:bg-[#5D8670]"
    : "active:translate-y-0 active:shadow-sm";

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`
        bg-[#81B29A] text-[#F4F1DE]
        ${hoverEffects}
        ${activeEffects}
        transition-all duration-300
        flex items-center justify-center cursor-pointer shadow-sm
        ${isCompact 
          ? "px-4 py-1.5 text-lg rounded"
          : "px-4 py-2 text-sm"
        }
        ${!isCompact && !showText && !inSearchBar ? "rounded-r-md" : ""}
        ${className}
      `}
      aria-label="Search"
      title="Search recipes"
    >
      <FaSearch className={`${isCompact ? 'text-lg' : 'text-base'} ${showText ? 'md:mr-2' : ''} transition-transform duration-300`} />
      {showText && <span className="hidden md:inline">Search</span>}
    </button>
  );
};

export default SearchButton;
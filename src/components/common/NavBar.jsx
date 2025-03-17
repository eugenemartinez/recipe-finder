import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useNavigation } from '../../context/NavigationContext';
import { useSearch } from '../../context/SearchContext';
import FavoritesButton from './FavoritesButton';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get searchTerm from context
  const { searchTerm: contextSearchTerm, setSearchTerm } = useNavigation();
  
  // Get reset function from search context if available
  const { resetSearch } = useSearch() || {};
  
  // Enhanced logo click handler to ensure proper reset
  const handleLogoClick = (e) => {
    e.preventDefault();
    
    // Clear search term in context
    if (setSearchTerm) {
      setSearchTerm('');
    }
    
    // Call the reset function from SearchContext if available
    if (typeof resetSearch === 'function') {
      resetSearch();
    }
    
    // Reset the page state and ensure we go to the homepage
    navigate('/', {
      state: {
        showHero: true,        // Explicitly show the hero
        preserveSearch: false, // Don't preserve the search
        resetSearch: true      // Signal to reset search
      },
      replace: true           // Replace current history entry instead of pushing a new one
    });
  };
  
  return (
    <nav className="bg-[#2D2A32] p-4 w-full left-0 right-0 shadow-md">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo with enhanced hover effects */}
        <button 
          onClick={handleLogoClick} 
          className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 group"
          aria-label="Go to home page"
        >
          <FaUtensils className="text-[#F2CC8F] mr-2 transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-[#F4F1DE] text-lg sm:text-xl font-bold transition-colors duration-300 group-hover:text-[#81B29A]">
            Recipe Finder
          </span>
        </button>
        
        {/* Using the new FavoritesButton component */}
        <FavoritesButton size="md" />
      </div>
    </nav>
  );
};

export default NavBar;
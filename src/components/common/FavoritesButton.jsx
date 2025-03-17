import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigation } from '../../context/NavigationContext';
import { motion } from 'framer-motion'; // Add Framer Motion import

/**
 * Reusable Favorites Button component with animation and count indicator
 * @param {Object} props - Component props
 * @param {string} props.className - Additional classNames for customization
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.showText - Whether to show 'Favorites' text
 * @param {string} props.variant - Color variant ('default', 'homepage')
 */
const FavoritesButton = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  variant = 'default'
}) => {
  const { favorites } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const { searchTerm: contextSearchTerm } = useNavigation();

  // Size classes mapping
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base",
    lg: "px-5 py-2.5 text-base"
  };
  
  // Color variants
  const variantClasses = {
    default: "bg-[#3D405B] text-[#F4F1DE]",
    homepage: "bg-[#D8A48F] text-[#3D405B]" // Dusty rose/terracotta with dark text
  };
  
  // Get color classes based on variant
  const colorClass = variantClasses[variant] || variantClasses.default;

  // Handle navigation to favorites with proper state
  const handleFavoritesClick = (e) => {
    e.preventDefault();
    
    // Use search term from context instead of querying DOM
    const searchTerm = contextSearchTerm || '';
    
    // Get current path
    const path = location.pathname;
    
    // Determine where we're navigating from and set appropriate state
    if (path.includes('/recipe/')) {
      // From recipe detail
      const recipeId = path.split('/recipe/')[1];
      navigate('/favorites', {
        state: {
          from: 'recipeDetail',
          recipeId,
          searchTerm: searchTerm 
        }
      });
    } else if (path === '/' && document.querySelector('.hero-section') === null) {
      // From search results (hero is hidden)
      navigate('/favorites', {
        state: {
          from: 'search',
          searchTerm: searchTerm
        }
      });
    } else {
      // From home or elsewhere
      navigate('/favorites', {
        state: {
          from: 'home',
          searchTerm: searchTerm
        }
      });
    }
  };
  
  // Heart beat animation for the icon
  const heartVariants = {
    beat: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 1.5
      }
    }
  };
  
  return (
    <motion.button 
      onClick={handleFavoritesClick}
      className={`flex items-center ${colorClass} 
                rounded-lg cursor-pointer shadow-sm
                ${sizeClasses[size]} ${className}`}
      aria-label="View favorite recipes"
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: variant === 'homepage' ? '#C89480' : '#81B29A',
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      whileTap={{ 
        scale: 0.98,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 15
      }}
    >
      <motion.div
        variants={heartVariants}
        animate={favorites.length > 0 ? "beat" : ""}
        className="relative"
      >
        <FaHeart 
          className={`${variant === 'homepage' ? 'text-[#E07A5F]' : 'text-[#E07A5F]'} mr-1.5 sm:mr-2`} 
        />
        
        {/* Small heart particles that appear on hover */}
        <motion.span 
          className="absolute -top-2 -right-1 w-1.5 h-1.5 rounded-full bg-[#E07A5F]"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ 
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            y: [-2, -8],
            x: [0, 5]
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
        />
        <motion.span 
          className="absolute -top-1 -left-1 w-1 h-1 rounded-full bg-[#E07A5F]"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ 
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
            y: [-1, -6],
            x: [-2, -4]
          }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.div>
      
      {showText && <span className="font-medium">Favorites</span>}
      
      {favorites.length > 0 && (
        <motion.span 
          className={`ml-1.5 sm:ml-2 ${variant === 'homepage' ? 'bg-[#3D405B] text-white' : 'bg-[#E07A5F] text-[#F4F1DE]'} px-1.5 sm:px-2 py-0.5 
                      rounded-full text-xs font-medium shadow-inner`}
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { duration: 0.3, delay: 0.1 }
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
        >
          {favorites.length}
        </motion.span>
      )}
    </motion.button>
  );
};

export default FavoritesButton;
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaYoutube, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import framer-motion
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSearch } from '../../context/SearchContext'; // Import search context
import AnimatedHeartButton from './AnimatedHeartButton'; // Import the new component

const RecipeCard = ({ id, title, description, image, tags, videoUrl, fromSearch, fromPage, readyInMinutes }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { setSearchTerm, setFromPage, setFromRecipeId, originalFromPage } = useNavigation() || {};
  const { isNewSearch } = useSearch(); // Get this from search context
  
  // Use ref to track if animation has already run
  const hasAnimated = useRef(false);
  
  // State to track card press (for animation)
  const [isPressed, setIsPressed] = useState(false);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ id, title, description, image, tags, videoUrl });
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    if (videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    if (typeof fromSearch === 'string' && fromSearch) {
      setSearchTerm(fromSearch);
    }
    setFromPage(fromPage || 'search');
    setFromRecipeId(id);
  };

  return (
    <motion.div
      initial={isNewSearch ? { opacity: 0, y: 20 } : false}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isPressed ? 0.98 : 1,
        boxShadow: isPressed ? "0 0 0 rgba(0,0,0,0)" : "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
      }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut",
        scale: {
          duration: 0.1
        }
      }}
      whileHover={{ y: -5 }}
      onAnimationComplete={() => {
        hasAnimated.current = true;
      }}
    >
      <Link 
        to={`/recipe/${id}`} 
        state={{ 
          from: fromPage || 'search',
          searchTerm: typeof fromSearch === 'string' ? fromSearch : '',
          fromPage: fromPage,
          originalFromPage: originalFromPage || fromPage,
          preserveScroll: true
        }}
        onClick={handleCardClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className="group bg-[#2D2A32] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          
          {/* Optional: Add a subtle overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          {readyInMinutes && (
            <div className="absolute bottom-2 left-2 flex items-center bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              <FaClock className="mr-1" size={12} />
              <span>{readyInMinutes} min</span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-[#F4F1DE] pr-2 transition-colors duration-300 group-hover:text-[#81B29A]">{title}</h2>
            
            {/* Replace the button with our new component */}
            <AnimatedHeartButton 
              isFavorite={isFavorite(id)} 
              onClick={handleFavoriteClick}
              recipeName={title} // Pass the recipe title
            />
          </div>

          <p className="text-[#E6DFD9] mb-3 line-clamp-2">{description}</p>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center">
              {/* Tags on the left */}
              <div className="flex flex-wrap flex-1">
                {tags && tags.length > 0 && (
                  tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index} 
                      className="mr-1 mb-1 px-2 py-0.5 bg-[#3D405B] text-[#F4F1DE] rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
              
              {/* Action buttons on the right */}
              <div className="flex gap-2 ml-2 flex-shrink-0">
                <motion.button 
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center px-2 py-1 bg-[#81B29A] hover:bg-[#6A967F] text-[#F4F1DE] rounded-md transition-colors text-xs cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEye className="mr-1" size={12} />
                  View
                </motion.button>
                
                {videoUrl && (
                  <motion.button
                    onClick={handleVideoClick}
                    className="flex items-center px-2 py-1 bg-[#E07A5F] hover:bg-[#D06A4F] text-[#F4F1DE] rounded-md transition-colors text-xs cursor-pointer"
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaYoutube className="mr-1" size={12} />
                    Watch
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
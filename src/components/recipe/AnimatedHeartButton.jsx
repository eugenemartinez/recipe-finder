import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { useNotification } from '../../context/NotificationContext';

const AnimatedHeartButton = ({ 
  isFavorite, 
  onClick, 
  size = 16, 
  className = "",
  recipeName = "" // Add recipe name prop
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [wasInFavorites, setWasInFavorites] = useState(isFavorite);
  const { showFavoriteAdded, showFavoriteRemoved } = useNotification();
  
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);
  
  const handleClick = (e) => {
    // Store previous state before changing
    setWasInFavorites(isFavorite);
    setIsAnimating(true);
    
    // Show appropriate notification
    if (isFavorite) {
      showFavoriteRemoved(recipeName || "Recipe");
    } else {
      showFavoriteAdded(recipeName || "Recipe");
    }
    
    // Call original onClick handler
    onClick(e);
  };
  
  const animationClass = isAnimating 
    ? (wasInFavorites ? 'animate-unfavorite' : 'animate-favorite') 
    : '';

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-300 cursor-pointer 
                ${isFavorite 
                  ? 'bg-[#E07A5F] text-white hover:bg-[#D06A4F] hover:-translate-y-0.5 hover:shadow-md' 
                  : 'bg-[#3D405B] hover:bg-[#565B7F] text-[#F4F1DE] hover:-translate-y-0.5 hover:shadow-md'
                } ${animationClass} ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <FaHeart 
          size={size}
          className="text-white transition-transform duration-300 group-hover:scale-125 group-active:scale-110" 
        />
      ) : (
        <FaRegHeart 
          size={size}
          className="text-[#F4F1DE] transition-transform duration-300 group-hover:scale-125 group-active:scale-110" 
        />
      )}
    </button>
  );
};

export default AnimatedHeartButton;
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  
  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Enhanced smooth scroll function
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const duration = 500;
    const startTime = performance.now();
    
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const easeProgress = 1 - Math.pow(1 - Math.min(elapsedTime / duration, 1), 3);
      const nextPosition = startPosition * (1 - easeProgress);
      
      window.scrollTo(0, nextPosition);
      
      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };
  
  // Hide on specific pages
  const isRecipeDetailsPage = location.pathname.includes('/recipe/');
  // Also check if we're in a preserved scroll position (like when returning from a recipe)
  const shouldPreserveScroll = location.state?.preserveScroll;
  
  if (isRecipeDetailsPage || shouldPreserveScroll) {
    return null;
  }
  
  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-24 right-8 z-40 p-4 rounded-full bg-[#81B29A] text-[#F4F1DE] 
                shadow-lg hover:shadow-xl flex items-center justify-center 
                hover:bg-[#6A967F] cursor-pointer"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
      }}
      transition={{
        type: "spring", 
        stiffness: 260, 
        damping: 20
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      whileTap={{ 
        y: 0, 
        scale: 1.05,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      aria-label="Scroll to top"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <FaArrowUp className="text-xl" />
    </motion.button>
  );
};

export default ScrollToTop;
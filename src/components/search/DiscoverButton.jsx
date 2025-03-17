import React from 'react';
import { FaCompass } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * DiscoverButton component for browsing all recipes
 * @param {Function} onClick - Function to handle click event
 * @param {boolean} isMobile - Whether to use mobile styling
 * @param {string} className - Additional CSS classes
 */
const DiscoverButton = ({ onClick, isMobile = true, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        flex items-center justify-center
        bg-[#E07A5F] text-[#F4F1DE] font-medium rounded-md
        shadow-sm cursor-pointer 
        transition-colors duration-300
        ${isMobile 
          ? 'px-6 py-3 text-base' 
          : 'px-5 py-2.5 text-base'
        }
        ${className}
      `}
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.05, // Matching the SurpriseButton's wrapper scale
        backgroundColor: "#D06A4F", 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      whileTap={{ 
        scale: 0.98,
        backgroundColor: "#D06A4F",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 15
      }}
      title="Browse all recipes"
    >
      <motion.div className="flex items-center justify-center">
        <motion.span
          className="mr-2 inline-block"
          animate={{ rotate: [0, 0, 360] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
            times: [0, 0.2, 1] // Stay at 0 for 20% of the animation
          }}
        >
          <FaCompass className="text-lg" />
        </motion.span>
        Discover
      </motion.div>
      
      {/* Compass highlight effect */}
      <motion.span 
        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#F4F1DE]"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ 
          scale: [0, 1.5, 0],
          opacity: [0, 0.15, 0],
          x: '-50%',
          y: '-50%'
        }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.2 }}
      />
    </motion.button>
  );
};

export default DiscoverButton;
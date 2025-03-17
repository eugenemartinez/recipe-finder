import React from 'react';
import { FaMagic } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * SurpriseButton component renders the surprise button with responsive text
 * @param {Function} onClick - Function to handle the click event
 * @param {boolean} isCompact - Whether to show compact version (icon with shorter text)
 * @param {boolean} fullWidth - Whether button should take full width
 * @param {string} className - Additional classes to apply to the button
 */
const SurpriseButton = ({ 
  onClick, 
  isCompact = false,
  fullWidth = false,
  className = ""
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    className={`
      bg-[#F2CC8F] text-[#3D405B] font-medium flex items-center justify-center
      group cursor-pointer shadow-sm
      ${isCompact ? "px-4" : "px-5 py-2.5"}
      ${fullWidth ? "w-full py-2.5 rounded-md mt-3" : isCompact ? "rounded-r-md" : "rounded-md"}
      ${className}
    `}
    title="Find a random recipe"
    initial={{ y: 0 }}
    whileHover={{ 
      y: -2,
      backgroundColor: "#E6C276",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}
    whileTap={{ 
      y: 0,
      scale: 0.98,
      backgroundColor: "#E6C276",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
    }}
    transition={{ 
      type: "spring",
      stiffness: 500,
      damping: 17
    }}
  >
    <motion.div
      animate={{ rotate: [0, 10, 0] }}
      transition={{ 
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2.5,
        ease: "easeInOut"
      }}
      className="flex items-center justify-center"
    >
      <FaMagic className={`text-lg ${!isCompact || fullWidth ? 'mr-2' : 'md:mr-2'}`} /> 
      <span className={isCompact && !fullWidth ? "hidden md:inline text-lg" : ""}>
        {isCompact ? "Surprise!" : "Surprise!"}
      </span>
    </motion.div>

    {/* Magic sparkles effect on hover */}
    <motion.span 
      className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ 
        scale: [0, 1.2, 0],
        opacity: [0, 0.8, 0],
        x: [-5, -10],
        y: [-5, -15]
      }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.3 }}
    />
    <motion.span 
      className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-white"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ 
        scale: [0, 1, 0],
        opacity: [0, 0.7, 0],
        x: [3, 8],
        y: [3, 12]
      }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
    />
  </motion.button>
);

export default SurpriseButton;
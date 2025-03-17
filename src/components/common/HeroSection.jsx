import React from 'react';
import { FaUtensils } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HeroSection = ({ className = '' }) => {
  return (
    <div className={`w-full pt-0 pb-8 md:py-16 relative ${className}`}>
      {/* Content - keeping all animations */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Interactive utensil icon */}
        <motion.div 
          className="flex justify-center mb-2 md:mb-6" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="p-2 md:p-4 bg-[#2D2A32] rounded-full shadow-lg overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <motion.div 
              className="relative z-10"
              whileHover={{ rotate: 12 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaUtensils className="text-[#F2CC8F] text-3xl md:text-5xl" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Heading */}
        <motion.h1 
          className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-[#F4F1DE] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to{' '}
          <motion.span 
            className="text-[#F2CC8F]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Recipe Finder
          </motion.span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-base md:text-xl text-[#E6DFD9] mb-4 md:mb-8 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Discover delicious recipes for every taste, occasion, and skill level
        </motion.p>
        
        {/* Animated divider */}
        <div className="relative flex justify-center">
          <motion.div 
            className="h-1 md:h-1.5 bg-[#E07A5F] mx-auto rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "5rem", opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          />
          <motion.div 
            className="absolute w-2 md:w-3 h-2 md:h-3 bg-[#E07A5F] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
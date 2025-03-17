import React from 'react';
import { motion } from 'framer-motion';

/**
 * Custom transition component specifically for the HomePage
 * Handles fade transitions with special handling for hero section
 */
const HomePageTransition = ({ children, showHero }) => {
  // Different animation variants based on whether hero is showing
  const variants = {
    initial: { 
      opacity: 0,
    },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="w-full"
      style={{ 
        backgroundColor: "#3D405B", // Match your app's background color
        minHeight: "100vh"
      }}
    >
      {children}
    </motion.div>
  );
};

export default HomePageTransition;
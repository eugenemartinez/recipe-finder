import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable page transition component
 * Applies consistent enter/exit animations across pages
 */
const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
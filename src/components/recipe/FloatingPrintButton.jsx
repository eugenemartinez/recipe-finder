import React, { useEffect } from 'react';
import { FaPrint } from 'react-icons/fa';
import { usePrintRecipe } from '../../hooks/usePrintRecipe';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingPrintButton = ({ 
  recipe, 
  servings, 
  adjustQuantity,
  showPrintTooltip, 
  setShowPrintTooltip 
}) => {
  const { printRecipe } = usePrintRecipe();

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPrintTooltip && !event.target.closest('#printFloatBtn')) {
        setShowPrintTooltip(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPrintTooltip, setShowPrintTooltip]);

  return (
    <motion.div 
      className="fixed bottom-24 right-8 z-50 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3
      }}
    >
      <div className="relative" id="printFloatBtn">
        <motion.button
          onClick={() => {
            if (showPrintTooltip) {
              // Second click - print the recipe
              printRecipe(recipe, servings, adjustQuantity);
            } else {
              // First click - just show the tooltip/expanded state
              setShowPrintTooltip(true);
            }
          }}
          className={`
            ${showPrintTooltip ? 'bg-[#6A967F]' : 'bg-[#81B29A]'} 
            text-white p-4 rounded-full shadow-lg flex items-center justify-center 
            cursor-pointer
          `}
          animate={{ 
            width: showPrintTooltip ? 'auto' : 'auto',
            paddingLeft: showPrintTooltip ? '1.25rem' : '1rem',
            paddingRight: showPrintTooltip ? '1.25rem' : '1rem'
          }}
          whileHover={{ 
            scale: 1.1,
            y: -4,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          }}
          whileTap={{ 
            scale: 1.05,
            y: 0,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          aria-label="Print Recipe"
          aria-expanded={showPrintTooltip}
        >
          <motion.span
            animate={{ rotate: showPrintTooltip ? 12 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaPrint className="text-xl" />
          </motion.span>
          
          <AnimatePresence initial={false}>
            {showPrintTooltip && (
              <motion.span 
                className="ml-2 whitespace-nowrap overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ 
                  opacity: 0,
                  width: 0,
                  transition: { 
                    opacity: { duration: 0.1, ease: "easeOut" }, 
                    width: { delay: 0.1, duration: 0.2 } 
                  }
                }}
              >
                Print Recipe
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FloatingPrintButton;
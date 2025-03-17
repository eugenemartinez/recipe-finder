import React from 'react';
import { FaUtensils } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ServingsAdjuster from '../common/ServingsAdjuster';

const RecipeIngredients = ({ recipe, servings, updateServings, adjustQuantity, recentlyUpdated }) => {
  return (
    <div className="bg-[#3D405B] bg-opacity-20 rounded-lg p-5 mt-6 mb-6 border border-[#3D405B]">
      {/* Ingredients Section Title */}
      <h2 className="text-2xl font-bold mb-4 text-[#81B29A] flex items-center">
        <FaUtensils className="mr-2" />
        Ingredients
      </h2>
      
      {/* Use the ServingsAdjuster component */}
      <ServingsAdjuster 
        initialServings={servings} 
        onChange={updateServings}
      />
      
      {/* Divider between servings adjuster and ingredients list */}
      <div className="border-b border-[#3D405B] my-2"></div>
      
      {/* Ingredients List */}
      <ul className="list-none space-y-2">
        {recipe.ingredients.map((ingredient, index) => (
          <motion.li 
            key={index} 
            animate={{
              backgroundColor: recentlyUpdated 
                ? ['rgba(0, 0, 0, 0)', 'rgba(129, 178, 154, 0.4)', 'rgba(129, 178, 154, 0.2)']
                : 'rgba(0, 0, 0, 0)',
              boxShadow: recentlyUpdated 
                ? ['none', '0 0 0 1px rgba(129, 178, 154, 0.5)', 'none'] 
                : 'none'
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeOut",
              times: [0, 0.2, 1]
            }}
            className="flex items-center py-1 px-2 rounded"
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-[#81B29A] rounded-full mr-3 flex-shrink-0"
              animate={{
                scale: recentlyUpdated ? [1, 1.5, 1] : 1
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1]
              }}
            ></motion.div>
            <motion.span 
              className="text-[#F4F1DE]"
              animate={{ 
                y: recentlyUpdated ? [0, -3, 0] : 0,
                scale: recentlyUpdated ? [1, 1.03, 1] : 1,
                textShadow: recentlyUpdated 
                  ? ['none', '0 0 4px rgba(129, 178, 154, 0.8)', 'none'] 
                  : 'none'
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                times: [0, 0.3, 1]
              }}
            >
              {adjustQuantity(ingredient)}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
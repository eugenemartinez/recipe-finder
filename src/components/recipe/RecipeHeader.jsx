import React from 'react';
import AnimatedHeartButton from './AnimatedHeartButton';
import { motion } from 'framer-motion'; // Add framer motion

const RecipeHeader = ({ recipe, isFavorite, toggleFavorite }) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-64 object-cover rounded-lg shadow mb-4" 
        />
        
        {/* Position the AnimatedHeartButton in the top-right corner */}
        <div className="absolute top-3 right-3">
          <AnimatedHeartButton 
            isFavorite={isFavorite} 
            onClick={toggleFavorite}
            recipeName={recipe.title} // Add the recipe title for notifications
            size={20} // Slightly larger icon for the header
            className="p-3 shadow bg-opacity-80" // Add some extra styling for this context
          />
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#F4F1DE]">{recipe.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.category && (
              <motion.span 
                className="bg-[#E07A5F] text-[#F4F1DE] px-2 py-1 rounded text-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {recipe.category}
              </motion.span>
            )}
            {recipe.area && (
              <motion.span 
                className="bg-[#F2CC8F] text-[#3D405B] px-2 py-1 rounded text-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {recipe.area}
              </motion.span>
            )}
            
            {/* Recipe tags added here */}
            {recipe.tags && recipe.tags.map((tag) => (
              <motion.span 
                key={tag}
                className="bg-[#81B29A] text-[#F4F1DE] px-2 py-1 rounded text-sm"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  hover: { duration: 0.2 }
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;
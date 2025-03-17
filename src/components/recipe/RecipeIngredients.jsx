import React from 'react';
import { FaUtensils } from 'react-icons/fa';
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
        initialServings={4} 
        onChange={updateServings}
      />
      
      {/* Divider between servings adjuster and ingredients list */}
      <div className="border-b border-[#3D405B] my-2"></div>
      
      {/* Ingredients List */}
      <ul className="list-none space-y-2">
        {recipe.ingredients.map((ingredient, index) => (
          <li 
            key={index} 
            className={`flex items-center py-1 px-2 rounded ${
              recentlyUpdated ? 'bg-[#81B29A] bg-opacity-20 transition-colors duration-500' : ''
            }`}
          >
            <div className="w-1.5 h-1.5 bg-[#81B29A] rounded-full mr-3 flex-shrink-0"></div>
            <span className="text-[#F4F1DE]">{adjustQuantity(ingredient)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMagic } from 'react-icons/fa';
import RecipeCard from './RecipeCard';
import { useNavigation } from '../../context/NavigationContext';
import { preloadRecipe } from '../../hooks/useRecipeData'; // Add preloading capability

const RelatedRecipes = ({ currentRecipe, relatedRecipes, onSurpriseClick, isLoading = false }) => {
  const navigate = useNavigate();
  // Get access to the navigation context
  const { 
    searchTerm: contextSearchTerm, 
    originalFromPage 
  } = useNavigation() || {};

  // Filter out current recipe and ensure we have tag matches
  const filteredRelated = relatedRecipes
    .filter(r => 
      r.id !== currentRecipe.id && 
      r.tags && 
      currentRecipe.tags &&
      r.tags.some(tag => currentRecipe.tags.includes(tag))
    )
    .slice(0, 3);

  // Handle prefetching when hovering over a recipe
  const handleRecipeHover = (recipeId) => {
    preloadRecipe(recipeId);
  };

  // Show loading state if related recipes are still loading
  if (isLoading) {
    return (
      <div className="border-t border-[#3D405B] pt-6">
        <h3 className="text-xl font-bold mb-4 text-[#F4F1DE]">You Might Also Like</h3>
        <div className="flex justify-center items-center py-8">
          <div className="w-6 h-6 border-2 border-t-transparent border-[#F4F1DE] rounded-full animate-spin"></div>
          <span className="ml-3 text-[#E6DFD9]">Finding related recipes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-[#3D405B] pt-6">
      <h3 className="text-xl font-bold mb-4 text-[#F4F1DE]">You Might Also Like</h3>
      
      {filteredRelated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filteredRelated.map(recipe => (
            <div 
              key={recipe.id}
              onMouseEnter={() => handleRecipeHover(recipe.id)} 
              onTouchStart={() => handleRecipeHover(recipe.id)}
            >
              <RecipeCard
                id={recipe.id}
                title={recipe.title}
                description={recipe.description || `${recipe.category || ''} ${recipe.category && recipe.area ? '|' : ''} ${recipe.area || ''}`}
                image={recipe.image}
                tags={recipe.tags || []}
                videoUrl={recipe.video || recipe.videoUrl}
                fromSearch={contextSearchTerm || ''}
                fromPage="recipeDetail"
                // Pass the original page source to preserve chain
                originalFromPage={originalFromPage}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#3D405B] rounded-lg p-6 text-center">
          <p className="text-[#E6DFD9]">No related recipes found. Try exploring more recipes!</p>
          <button
            onClick={onSurpriseClick}
            className="mt-4 px-4 py-2 bg-[#F2CC8F] text-[#3D405B] rounded-md
                     hover:bg-[#E6C276] font-medium cursor-pointer
                     transition-all duration-300 
                     hover:-translate-y-1 hover:shadow-md 
                     active:translate-y-0 active:shadow-sm
                     flex items-center justify-center mx-auto group"
          >
            <FaMagic className="mr-2 transition-transform duration-300 group-hover:rotate-12" />
            Discover a Random Recipe
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedRecipes;
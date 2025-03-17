import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { useNavigation } from '../../context/NavigationContext';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useScroll } from '../../context/ScrollContext';

const RecipeList = ({ recipes = [], filterTag, searchTerm, isDiscoverMode }) => {
  const { originalFromPage } = useNavigation() || {};
  const location = useLocation();
  const { saveScrollPosition } = useScroll();
  
  // Generate a stable key to identify this specific list view
  const scrollKey = isDiscoverMode 
    ? 'discover_recipes' 
    : `search_${searchTerm || 'all'}${filterTag ? '_tag_' + filterTag : ''}`;
  
  // Filter recipes if a tag is selected
  const filteredRecipes = filterTag 
    ? recipes.filter(recipe => 
        (recipe.tags && recipe.tags.includes(filterTag)) || 
        recipe.category === filterTag || 
        recipe.area === filterTag
      )
    : recipes;
    
  // Use our infinite scroll hook with the scroll key
  const { 
    displayedItems: displayedRecipes, 
    lastItemRef, 
    hasMoreItems 
  } = useInfiniteScroll(filteredRecipes, {
    itemsPerPage: 6,
    idField: 'id',
    addUniqueIdentifiers: true,
    scrollKey // Pass the key for state persistence
  });
  
  // Determine if we should show ScrollToTop button
  // Don't show it when we're restoring a scroll position
  const showScrollToTop = !location.state?.preserveScroll;
  
  // Save scroll position when component unmounts
  useEffect(() => {
    return () => {
      if (scrollKey) {
        saveScrollPosition(scrollKey);
      }
    };
  }, [scrollKey, saveScrollPosition]);
  
  return (
    <div className="w-full">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-2 pb-6">
        {filteredRecipes.length > 0 ? (
          displayedRecipes.map((recipe, index) => {
            // For the last item, add the ref for infinite scrolling
            if (index === displayedRecipes.length - 1) {
              return (
                <div ref={lastItemRef} key={recipe._uniqueId} className="w-full">
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    description={recipe.category ? `${recipe.category} | ${recipe.area || ''}` : ''}
                    image={recipe.image}
                    tags={recipe.tags || []}
                    videoUrl={recipe.video || recipe.videoUrl}
                    fromSearch={searchTerm}
                    fromPage="search"
                    originalFromPage={originalFromPage || 'search'}
                  />
                </div>
              );
            } else {
              return (
                <div key={recipe._uniqueId} className="w-full">
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    description={recipe.category ? `${recipe.category} | ${recipe.area || ''}` : ''}
                    image={recipe.image}
                    tags={recipe.tags || []}
                    videoUrl={recipe.video || recipe.videoUrl}
                    fromSearch={searchTerm}
                    fromPage="search"
                    originalFromPage={originalFromPage || 'search'}
                  />
                </div>
              );
            }
          })
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8">
            <p className="text-xl text-[#F4F1DE]">
              No recipes found{searchTerm ? ` for "${searchTerm}"` : ''}. Try a different search or tag!
            </p>
          </div>
        )}
      </div>
      
      {/* Add loading indicator to help trigger intersection observer */}
      {hasMoreItems && displayedRecipes.length > 0 && (
        <div className="text-center py-2" ref={lastItemRef}>
          <div className="inline-block animate-pulse">
            <p className="text-sm text-[#E6DFD9]">Loading more recipes...</p>
          </div>
        </div>
      )}
      
      {displayedRecipes.length > 0 && !hasMoreItems && (
        <div className="text-center py-4">
          <p className="text-md text-[#E6DFD9]">— End of results —</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
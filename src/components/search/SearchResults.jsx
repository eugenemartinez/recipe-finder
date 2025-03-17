import React from 'react';
import { FaSync } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import TagsFilter from '../common/TagsFilter';
import RecipeList from '../recipe/RecipeList';
import LoadingSpinner from '../common/LoadingSpinner';
import { useSearch } from '../../context/SearchContext';
import { useScroll } from '../../context/ScrollContext';
import { useNavigation } from '../../context/NavigationContext';

const SearchResults = ({
  loading,
  error,
  searchTerm,
  recipes,
  filteredRecipes,
  allTags,
  activeTag,
  onTagClick,
  onClearError,
  isDiscoverMode = false,
  onRefreshDiscover
}) => {
  // Get the refresh function from SearchContext
  const { refreshDiscoverRecipes } = useSearch();
  const { clearSavedState } = useScroll();
  const { activeTag: navigationActiveTag } = useNavigation();
  
  // Use the active tag from props if available, otherwise from navigation context
  const effectiveTag = activeTag !== undefined ? activeTag : navigationActiveTag;
  
  // Enhanced refresh handler
  const handleRefresh = () => {
    if (!isDiscoverMode) return;
    
    // Clear scroll state for discover recipes
    clearSavedState('discover_recipes');
    
    // Use the existing function to refresh recipes
    refreshDiscoverRecipes();
  };

  // Use AnimatePresence only for loading/error states - not for tag changes
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center my-12 w-full"
          >
            <LoadingSpinner />
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center my-12 w-full"
          >
            <p className="text-xl text-[#F4F1DE] mb-6">{error}</p>
            <motion.button
              onClick={onClearError}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 bg-[#81B29A] text-[#F4F1DE] rounded 
                      hover:bg-[#6A967F] hover:shadow-md
                      active:shadow-sm
                      transition-colors duration-300 cursor-pointer"
            >
              Back to Home
            </motion.button>
          </motion.div>
        ) : (
          // Main content container - key only based on searchTerm, not tag
          <motion.div 
            key={`results-${searchTerm}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDiscoverMode ? (
              <motion.div 
                className="flex justify-between items-center mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-medium mt-4 text-[#F4F1DE]">
                  Discover Recipes
                </h2>
                <motion.button
                  onClick={handleRefresh}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ y: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}
                  className="flex items-center px-2 py-1 mt-4 text-sm border border-[#E6DFD9] text-[#E6DFD9] 
                            rounded-md hover:bg-[#3D405B] hover:border-[#81B29A] 
                            transition-colors duration-300 cursor-pointer group"
                  aria-label="Refresh discover recipes"
                >
                  <motion.span 
                    className="inline-block mr-1"
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaSync size={12} />
                  </motion.span>
                  Refresh
                </motion.button>
              </motion.div>
            ) : (
              // Search results header with inline animations that don't unmount
              <div className="flex justify-center items-center mb-4 mt-4">
                <motion.h2 
                  className="text-lg font-medium text-[#F4F1DE] text-center"
                  key={`header-count-${filteredRecipes.length}-tag-${effectiveTag || 'all'}`}
                  animate={{ 
                    scale: [0.98, 1],
                    opacity: [0.8, 1]
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} 
                  {effectiveTag ? ` with "${searchTerm}" tagged with "${effectiveTag}"` : ` with "${searchTerm}"`}
                </motion.h2>
              </div>
            )}
            
            {/* Show tags with no initial animation - always visible */}
            {!isDiscoverMode && allTags.length > 0 && (
              <div className="mb-4">
                <TagsFilter 
                  tags={allTags}
                  activeTag={effectiveTag}
                  onTagClick={onTagClick}
                  recipes={recipes}
                />
              </div>
            )}
            
            {/* Recipe list still has animation on tag change */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`recipe-list-${effectiveTag || 'all'}-${searchTerm}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <RecipeList 
                  recipes={filteredRecipes}
                  searchTerm={searchTerm}
                  isDiscoverMode={isDiscoverMode}
                  filterTag={effectiveTag}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
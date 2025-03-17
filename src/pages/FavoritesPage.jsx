import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '../context/NavigationContext';
import { useFavoritesNavigation } from '../hooks/useFavoritesNavigation';
import { useNotification } from '../context/NotificationContext';
import RecipeCard from '../components/recipe/RecipeCard';
import MainLayout from '../layouts/MainLayout';

/**
 * FavoritesPage Component
 * Displays and manages user's favorite recipes
 */
const FavoritesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, isFavorite, isNewFavoriteView, resetAnimationState } = useFavorites();
  
  // Use our navigation hook
  const { handleBack } = useFavoritesNavigation();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);
  
  // Context values
  const { 
    searchTerm: contextSearchTerm,
    setSearchTerm: setContextSearchTerm, 
    setFromPage,
    setOriginalFromPage
  } = useNavigation() || {};

  // Update navigation context on mount
  useEffect(() => {
    if (setFromPage) setFromPage('favorites');
    if (setOriginalFromPage) setOriginalFromPage('favorites');
    
    if (location.state?.searchTerm && setContextSearchTerm) {
      setContextSearchTerm(location.state.searchTerm);
    }
  }, [setFromPage, setOriginalFromPage, location.state, setContextSearchTerm]);

  // Reset animation state after mounting to ensure animations don't play when returning
  useEffect(() => {
    // Wait a bit to allow initial animations to complete
    const timer = setTimeout(() => {
      resetAnimationState();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [resetAnimationState]);

  // Filter favorites when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFavorites(favorites);
      return;
    }

    const filtered = filterRecipesByTerm(favorites, searchTerm);
    setFilteredFavorites(filtered);
  }, [searchTerm, favorites]);

  // Clear search term
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Navigate to home to find recipes
  const handleFindRecipes = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <MainLayout>
      <PageTransition className="w-full max-w-6xl mx-auto py-8 px-2 sm:px-4">
        <FavoritesHeader onBack={handleBack} />
        
        {/* Search input */}
        <AnimatePresence>
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={handleClearSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display recipes or appropriate message */}
        <AnimatePresence mode="wait">
          <motion.div
            key="favorites-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FavoritesContent
              favorites={favorites}
              filteredFavorites={filteredFavorites}
              searchTerm={searchTerm}
              fromSearch={location.state?.searchTerm || contextSearchTerm || ''}
              onClearSearch={handleClearSearch}
              onFindRecipes={handleFindRecipes}
              isFavorite={isFavorite}
              isNewFavoriteView={isNewFavoriteView}
            />
          </motion.div>
        </AnimatePresence>
      </PageTransition>
    </MainLayout>
  );
};

// Header component with title and back button
const FavoritesHeader = memo(({ onBack }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-between items-center mb-6"
  >
    <h1 className="text-xl font-bold text-[#F4F1DE]">My Favorite Recipes</h1>
    <motion.button
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBack}
      className="px-4 py-2 text-[#E6DFD9] hover:text-[#F4F1DE] 
                rounded-md hover:bg-[#3D405B]/30
                hover:-translate-y-0.5 hover:shadow-sm
                active:translate-y-0 active:shadow-none
                transition-all duration-300 cursor-pointer flex items-center"
    >
      <span>&larr;</span>
      <span className="ml-1">Back</span>
    </motion.button>
  </motion.div>
));

// Search input component stays the same
const SearchInput = memo(({ value, onChange, onClear }) => (
  // Existing component implementation
  <div className="mb-6">
    <div className="flex items-stretch bg-[#2D2A32] rounded-lg overflow-hidden p-2">
      <div className="flex-grow flex items-center relative">
        <FaSearch className="text-[#E6DFD9] absolute left-3" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search in favorites..."
          className="py-2 pl-9 pr-3 w-full bg-[#3D405B] border border-[#3D405B] 
                   text-[#F4F1DE] rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-[#81B29A] 
                   focus:border-[#81B29A]
                   placeholder-[#E6DFD9] placeholder-opacity-70
                   focus:placeholder-opacity-90
                   transition-all duration-200 ease-in-out"
        />
        {value && (
          <motion.button 
            onClick={onClear}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 text-[#E6DFD9] hover:text-[#F4F1DE]
                     hover:scale-110 transition-transform duration-200"
            aria-label="Clear search"
          >
            &times;
          </motion.button>
        )}
      </div>
    </div>
  </div>
));

// FavoritesContent component stays the same
const FavoritesContent = ({
  favorites,
  filteredFavorites,
  searchTerm,
  fromSearch,
  onClearSearch,
  onFindRecipes,
  isFavorite,
  isNewFavoriteView
}) => {
  // Existing component implementation
  const { removeFromFavorites, markRecipeVisited } = useFavorites();
  const { showFavoriteRemoved } = useNotification();

  // Handle favorite removal with notification
  const handleRemoveFavorite = useCallback((e, recipe) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show notification
    showFavoriteRemoved(recipe.title);
    
    // Remove from favorites
    removeFromFavorites(recipe.id);
  }, [removeFromFavorites, showFavoriteRemoved]);

  const handleCardClick = useCallback((id) => {
    // Mark this recipe as visited so we don't animate it when returning
    markRecipeVisited(id);
  }, [markRecipeVisited]);

  if (favorites.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-12 bg-[#2D2A32] rounded-lg"
      >
        <p className="text-xl text-[#F4F1DE] mb-4">You haven't saved any favorites yet!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFindRecipes}
          className="px-6 py-2 bg-[#81B29A] text-[#F4F1DE] rounded hover:bg-[#6A967F]"
        >
          Find Recipes
        </motion.button>
      </motion.div>
    );
  }

  if (searchTerm && filteredFavorites.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-8 bg-[#2D2A32] rounded-lg"
      >
        <p className="text-xl text-[#F4F1DE]">No favorites match your search.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearSearch}
          className="px-6 py-2 mt-4 bg-[#81B29A] text-[#F4F1DE] rounded hover:bg-[#6A967F]"
        >
          Clear Search
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="popLayout">
        {filteredFavorites.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={isNewFavoriteView ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: -20,
              transition: { duration: 0.3 }
            }}
            transition={{ delay: isNewFavoriteView ? 0.1 + index * 0.05 : 0, duration: 0.4 }}
            layout
          >
            <RecipeCard
              id={recipe.id}
              title={recipe.title}
              description={recipe.description || `${recipe.category || ''} ${recipe.area ? '| ' + recipe.area : ''}`}
              image={recipe.image}
              tags={recipe.tags || []}
              videoUrl={recipe.video || recipe.videoUrl}
              fromSearch={fromSearch}
              fromPage="favorites"
              isNewSearch={isNewFavoriteView}
              onClick={() => handleCardClick(recipe.id)}
              isFavorite={true}
              handleFavoriteClick={(e) => handleRemoveFavorite(e, recipe)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Filter recipes by search term
 */
function filterRecipesByTerm(recipes, term) {
  if (!term?.trim()) return recipes;
  
  const lowerCaseSearch = term.toLowerCase();
  return recipes.filter(recipe => {
    // Search in title
    if (recipe.title?.toLowerCase().includes(lowerCaseSearch)) {
      return true;
    }
    
    // Search in tags
    if (recipe.tags && Array.isArray(recipe.tags) && 
        recipe.tags.some(tag => tag?.toLowerCase().includes(lowerCaseSearch))) {
      return true;
    }
    
    // Search in category and area
    if (recipe.category?.toLowerCase().includes(lowerCaseSearch)) {
      return true;
    }
    
    if (recipe.area?.toLowerCase().includes(lowerCaseSearch)) {
      return true;
    }
    
    return false;
  });
}

export default FavoritesPage;
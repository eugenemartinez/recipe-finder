import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import PageTransition from '../components/common/PageTransition';
import { useFavorites } from '../context/FavoritesContext';
import { useRecipeData } from '../hooks/useRecipeData';
import { useServingsCalculation } from '../hooks/useServingsCalculation';
import { useNavigation } from '../context/NavigationContext';
import { useTimerContext } from '../context/TimerContext';
import { useRandomRecipe } from '../hooks/useRandomRecipe';
import MainLayout from '../layouts/MainLayout';

// Import components
import LoadingSpinner from '../components/common/LoadingSpinner';
import RecipeHeader from '../components/recipe/RecipeHeader';
import RecipeIngredients from '../components/recipe/RecipeIngredients';
import RecipeInstructions from '../components/recipe/RecipeInstructions';
import RelatedRecipes from '../components/recipe/RelatedRecipes';
import FloatingPrintButton from '../components/recipe/FloatingPrintButton';
import SurpriseButton from '../components/common/SurpriseButton';
import SearchButton from '../components/common/SearchButton';

/**
 * Recipe Details Page Component
 * Displays a single recipe with details, ingredients, and instructions
 */
const RecipeDetailsPage = () => {
  // All your existing code remains the same...
  // Routing & Navigation
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationContext = useNavigation() || {};
  const { setIsAppLoading } = useTimerContext();
  
  // Use the random recipe hook
  const { getRandomRecipe } = useRandomRecipe();
  
  // UI State
  const [showVideo, setShowVideo] = useState(false);
  const [showPrintTooltip, setShowPrintTooltip] = useState(false);
  
  // Data & Functionality Hooks
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { recipe, relatedRecipes, loading, error, relatedLoading } = useRecipeData(id);
  const { servings, updateServings, adjustQuantity, recentlyUpdated } = useServingsCalculation(4);
  
  // Custom navigation handler for back button
  const handleBack = useCallback(() => {
    navigate(-1, { 
      state: { 
        preserveScroll: true 
      } 
    });
  }, [navigate]);
  
  // Handler for returning to search results
  const handleBackToSearch = useCallback(() => {
    // Simply navigate back to home page while preserving search state
    navigate('/', { 
      state: { 
        showHero: false,        // Keep search view active
        preserveSearch: true,   // Keep existing search state
        skipSearch: true        // Flag to avoid triggering a new search
      }
    });
  }, [navigate]);

  // Reset UI state when recipe changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowVideo(false);
    setShowPrintTooltip(false);
  }, [id]);

  // Handle clicks outside print tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPrintTooltip && !event.target.closest('#printFloatBtn')) {
        setShowPrintTooltip(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPrintTooltip]);

  // Sync with global loading state
  useEffect(() => {
    if (typeof setIsAppLoading === 'function') {
      setIsAppLoading(loading);
      return () => setIsAppLoading(false);
    }
  }, [loading, setIsAppLoading]);

  // Memoize event handlers to prevent unnecessary re-renders
  const toggleFavorite = useCallback(() => {
    if (!recipe) return;
    
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  }, [recipe, isFavorite, addToFavorites, removeFromFavorites]);
  
  // Use the getRandomRecipe directly from the hook
  const handleSurpriseClick = useCallback(() => {
    getRandomRecipe();
  }, [getRandomRecipe]);
  
  // Get search term from navigation context
  const { searchTerm } = useNavigation() || {};
  
  // Render appropriate UI based on state
  if (loading) {
    return (
      <MainLayout>
        <PageTransition className="flex justify-center items-center min-h-[calc(100vh-76px)]">
          <LoadingSpinner />
        </PageTransition>
      </MainLayout>
    );
  }

  if (error || !recipe) {
    return (
      <MainLayout>
        <PageTransition className="flex flex-col justify-center items-center min-h-[calc(100vh-76px)] text-[#F4F1DE] p-4">
          <div className="bg-[#2D2A32] p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Oops!</h1>
            <p className="mb-6">{error || "Recipe not found."}</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-[#81B29A] text-[#F4F1DE] rounded hover:bg-[#6A967F] cursor-pointer"
              >
                Go Home
              </motion.button>
              <SurpriseButton 
                onClick={handleSurpriseClick}
                isCompact={true}
                className="rounded"
              />
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition className="py-4">
        {/* Content inside PageTransition doesn't need exit animations */}
        <div key={id}>
          {/* Action Buttons - Back, Search, and Surprise */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto flex justify-between items-center mb-4"
          >
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="px-4 py-2 text-[#E6DFD9] hover:text-[#F4F1DE] 
                        rounded-md hover:bg-[#3D405B]/30
                        hover:-translate-y-0.5 hover:shadow-sm
                        active:translate-y-0 active:shadow-none
                        transition-all duration-300 cursor-pointer flex items-center"
            >
              <span>&larr;</span>
              <span className="ml-1">Back</span>
            </motion.button>
            
            <div className="flex space-x-2">
              <SearchButton 
                searchTerm={searchTerm}
                isCompact={true}
                showText={true}
                onClick={handleBackToSearch}
              />
              <SurpriseButton 
                onClick={handleSurpriseClick}
                className="rounded" 
                isCompact={true}
              />
            </div>
          </motion.div>
          
          {/* Recipe Content with staggered animations preserved */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2D2A32] p-6 rounded-lg shadow-lg max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <RecipeHeader 
                recipe={recipe} 
                isFavorite={isFavorite(recipe.id)} 
                toggleFavorite={toggleFavorite} 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <RecipeIngredients
                recipe={recipe}
                servings={servings}
                updateServings={updateServings}
                adjustQuantity={adjustQuantity}
                recentlyUpdated={recentlyUpdated}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <RecipeInstructions
                recipe={recipe}
                showVideo={showVideo}
                setShowVideo={setShowVideo}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <RelatedRecipes 
                currentRecipe={recipe}
                relatedRecipes={relatedRecipes}
                onSurpriseClick={handleSurpriseClick}
                isLoading={relatedLoading} // Pass the loading state
              />
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
      
      {/* Float printing button - Keep outside PageTransition */}
      <FloatingPrintButton
        recipe={recipe}
        servings={servings}
        adjustQuantity={adjustQuantity}
        showPrintTooltip={showPrintTooltip}
        setShowPrintTooltip={setShowPrintTooltip}
      />
    </MainLayout>
  );
};

export default RecipeDetailsPage;
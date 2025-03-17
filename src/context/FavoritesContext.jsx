import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { safeStorage } from '../utils/storage';

// Create context with default value
const FavoritesContext = createContext({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
  isNewFavoriteView: false,
  resetAnimationState: () => {}
});

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [initialized, setInitialized] = useState(false);
  
  // State to control animations
  const [isNewFavoriteView, setIsNewFavoriteView] = useState(true);
  
  // Keep track of visited recipes to avoid re-animating when returning from details
  const visitedRecipeIds = useRef(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = safeStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    // Only save if we've already loaded initial state
    if (initialized) {
      try {
        safeStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to storage:', error);
      }
    }
  }, [favorites, initialized]);

  // Check if a recipe is in favorites
  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  // Add a recipe to favorites
  const addToFavorites = (recipe) => {
    if (!isFavorite(recipe.id)) {
      setFavorites(prev => [...prev, recipe]);
      
      // Try to immediately save to storage as well
      try {
        const updatedFavorites = [...favorites, recipe];
        safeStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favorites directly:', error);
      }
      
      // Set animation state to true when a new favorite is added
      setIsNewFavoriteView(true);
    }
  };

  // Remove a recipe from favorites
  const removeFromFavorites = (id) => {
    setFavorites(prev => {
      const updated = prev.filter(recipe => recipe.id !== id);
      
      // Try to immediately save to storage
      try {
        safeStorage.setItem('favorites', JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorites after removal:', error);
      }
      
      // Set animation state to true when a favorite is removed
      setIsNewFavoriteView(true);
      
      return updated;
    });
  };
  
  // Function to mark a recipe as visited (called when viewing recipe details)
  const markRecipeVisited = (id) => {
    if (id) {
      visitedRecipeIds.current.add(id);
    }
  };
  
  // Function to reset animation state (called after animations complete)
  const resetAnimationState = () => {
    setIsNewFavoriteView(false);
  };

  // Context value
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    isNewFavoriteView,
    resetAnimationState,
    markRecipeVisited
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    console.warn('useFavorites must be used within a FavoritesProvider');
    return {
      favorites: [],
      addToFavorites: () => {},
      removeFromFavorites: () => {},
      isFavorite: () => false,
      isNewFavoriteView: false,
      resetAnimationState: () => {},
      markRecipeVisited: () => {}
    };
  }
  return context;
};
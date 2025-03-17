import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { searchRecipes, fetchAllRecipes } from '../services/api';
import { safeStorage } from '../utils/storage';
import { useNavigation } from './NavigationContext';
import { shuffleArray } from '../utils/recipeUtils';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  // Add ref for caching discover recipes
  const cachedDiscoverRecipes = useRef([]);
  
  // Rest of your existing state
  const { 
    searchTerm: contextSearchTerm, 
    setSearchTerm: setContextSearchTerm
  } = useNavigation() || {};

  // UI state
  const [showHero, setShowHero] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState(contextSearchTerm || '');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDiscoverMode, setIsDiscoverMode] = useState(false);
  
  // Animation control state
  const [isNewSearch, setIsNewSearch] = useState(false);
  
  // Filter state
  const [activeTag, setActiveTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
  
  // Search history
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = safeStorage.getItem('recipeSearchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading search history:', err);
      return [];
    }
  });
  
  // Extract tags from recipes
  useEffect(() => {
    if (recipes.length > 0) {
      const tagSet = new Set();
      
      recipes.forEach(recipe => {
        if (recipe.tags && Array.isArray(recipe.tags)) {
          recipe.tags.forEach(tag => tagSet.add(tag));
        }
        if (recipe.category) tagSet.add(recipe.category);
        if (recipe.area) tagSet.add(recipe.area);
      });
      
      setAllTags(Array.from(tagSet).sort());
    }
  }, [recipes]);

  /**
   * Randomizes the current recipe list
   */
  const randomizeRecipes = useCallback(() => {
    setRecipes(prevRecipes => shuffleArray([...prevRecipes]));
  }, []);

  /**
   * Search for recipes by term with caching for discover mode
   */
  const handleSearch = useCallback(async (term) => {
    if (!term?.trim()) return;
    
    setLoading(true);
    setError(null);
    setShowHero(false);
    setIsNewSearch(true); // Set animation flag to true
    
    // Reset active tag to null (All) on new search
    setActiveTag(null);
    
    // Check for discover mode keywords
    const normalizedTerm = term.toLowerCase().trim();
    const isDiscoverQuery = normalizedTerm === 'all' || 
                            normalizedTerm === 'discover' ||
                            normalizedTerm === 'discover recipes';
    
    // Set discover mode flag
    setIsDiscoverMode(isDiscoverQuery);
    
    // Update displayed search term
    if (isDiscoverQuery && term.toLowerCase() !== 'discover recipes') {
      setSearchTerm("Discover Recipes");
    } else {
      setSearchTerm(term);
    }
    
    // Update context when searching
    if (setContextSearchTerm) {
      setContextSearchTerm(isDiscoverQuery ? "Discover Recipes" : term);
    }
    
    // Add to search history (only for regular searches)
    if (!isDiscoverQuery && term.trim()) {
      const newHistory = [
        term,
        ...searchHistory.filter(item => item !== term)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      safeStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
    }

    try {
      let results;
      
      if (isDiscoverQuery) {
        // Check if we have cached results first
        if (cachedDiscoverRecipes.current.length > 0) {
          results = cachedDiscoverRecipes.current;
        } else {
          // Fetch all recipes for discover mode
          results = await fetchAllRecipes();
          // Randomize the results
          results = shuffleArray(results);
          // Cache the results
          cachedDiscoverRecipes.current = results;
        }
      } else {
        // Regular search - clear discover cache
        cachedDiscoverRecipes.current = [];
        results = await searchRecipes(term);
      }
      
      setRecipes(results);
      
      if (results.length === 0) {
        setError(`No recipes found${isDiscoverQuery ? '.' : ` for "${term}". Try a different search or tag!`}`);
      }
      
      return results;
    } catch (err) {
      setError('Failed to search for recipes. Please try again.');
      console.error('Error searching:', err);
      return [];
    } finally {
      setLoading(false);
      
      // Reset animation flag after a delay to allow animations to complete
      setTimeout(() => {
        setIsNewSearch(false);
      }, 1000);
    }
  }, [searchHistory, setContextSearchTerm]);

  /**
   * Clear discover cache and perform a fresh discover search
   */
  const refreshDiscoverRecipes = useCallback(async () => {
    cachedDiscoverRecipes.current = [];
    setIsNewSearch(true); // Set animation flag to true for refresh too
    const result = await handleSearch('all');
    
    // Reset animation flag after a delay
    setTimeout(() => {
      setIsNewSearch(false);
    }, 1000);
    
    return result;
  }, [handleSearch]);

  /**
   * Clear search history (single item or all)
   */
  const handleClearHistory = useCallback((term) => {
    let newHistory;
    if (term) {
      newHistory = searchHistory.filter(item => item !== term);
    } else {
      newHistory = [];
    }
    setSearchHistory(newHistory);
    safeStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
  }, [searchHistory]);

  /**
   * Clear error and return to hero view
   */
  const handleClearError = useCallback(() => {
    setShowHero(true);
    setError(null);
  }, []);

  /**
   * Filter recipes based on active tag
   */
  const getFilteredRecipes = useCallback(() => {
    return activeTag 
      ? recipes.filter(recipe => 
          (recipe.tags && recipe.tags.includes(activeTag)) ||
          recipe.category === activeTag ||
          recipe.area === activeTag
        )
      : recipes;
  }, [recipes, activeTag]);

  // Calculate filtered recipes
  const filteredRecipes = getFilteredRecipes();

  // Reset search for page navigation
  const resetSearch = useCallback(() => {
    setRecipes([]);
    setShowHero(true);
    setSearchTerm('');
    setActiveTag(null);
    setError(null);
  }, []);

  // Set recipes without search (for direct data setting)
  const setRecipesWithoutSearch = useCallback((newRecipes) => {
    setRecipes(newRecipes);
    if (newRecipes && newRecipes.length > 0) {
      setShowHero(false);
    }
  }, []);

  const value = {
    // Add the new animation flag
    isNewSearch,
    
    // Add the new function
    refreshDiscoverRecipes,
    
    // Existing values
    searchTerm,
    setSearchTerm,
    recipes,
    setRecipes: setRecipesWithoutSearch,
    loading,
    setLoading,
    error,
    setError,
    showHero,
    setShowHero,
    activeTag,
    setActiveTag,
    allTags,
    searchHistory,
    filteredRecipes,
    isDiscoverMode,
    
    // Functions
    handleSearch,
    handleClearHistory,
    handleClearError,
    resetSearch,
    randomizeRecipes
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
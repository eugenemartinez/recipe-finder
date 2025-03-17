import { useState } from 'react';
import { searchRecipes } from '../services/api';
import { safeStorage } from '../utils/storage';

export function useRecipeSearch(initialTerm = '', contextSetter = null) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allTags, setAllTags] = useState([]);
  
  // Use safeStorage instead of direct localStorage access
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = safeStorage.getItem('recipeSearchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading search history:', err);
      return [];
    }
  });

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchTerm(term);
    
    // Update context if provided
    if (contextSetter) {
      contextSetter(term);
    }
    
    // Add to search history
    if (term.trim()) {
      const newHistory = [
        term,
        ...searchHistory.filter(item => item !== term)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      try {
        safeStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
      } catch (err) {
        console.error('Error saving search history:', err);
      }
    }

    try {
      // Smart search across all fields
      const results = await searchRecipes(term);
      setRecipes(results);
      
      if (results.length === 0) {
        setError(`No recipes found for "${term}". Try a different search!`);
      } else {
      }
      
      // Extract all unique tags from results for filtering
      if (results.length > 0) {
        const tags = new Set();
        results.forEach(recipe => {
          if (recipe.tags && Array.isArray(recipe.tags)) {
            recipe.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags));
      }
    } catch (err) {
      setError('Failed to search for recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = (term) => {
    let newHistory;
    if (term) {
      newHistory = searchHistory.filter(item => item !== term);
    } else {
      newHistory = [];
    }
    setSearchHistory(newHistory);
    safeStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
  };

  return {
    searchTerm, setSearchTerm,
    recipes, setRecipes,
    loading, setLoading,
    error, setError, 
    searchHistory,
    handleSearch,
    handleClearHistory,
    allTags
  };
}
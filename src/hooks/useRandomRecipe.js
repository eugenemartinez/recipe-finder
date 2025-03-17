import { useState, useCallback } from 'react';
import { fetchRandomRecipe } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';

/**
 * Custom hook for handling random recipe functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Functions and state for handling random recipes
 */
export function useRandomRecipe(options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { clearSavedState } = useScroll();
  
  /**
   * Get a random recipe and navigate to its detail page
   */
  const getRandomRecipe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear any relevant scroll states to start fresh
      clearSavedState('discover_recipes');
      clearSavedState('search_all');
      
      // Fetch random recipe
      const randomRecipe = await fetchRandomRecipe();
      
      if (randomRecipe) {
        // Navigate to the recipe detail page
        navigate(`/recipe/${randomRecipe.id}`, {
          state: { 
            from: 'surprise',
            fromPage: 'surprise'
          }
        });
        return randomRecipe;
      } else {
        setError('Could not find a random recipe. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching random recipe:', err);
      setError('Failed to get a random recipe. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate, clearSavedState]);
  
  return {
    getRandomRecipe,
    loading,
    error
  };
}
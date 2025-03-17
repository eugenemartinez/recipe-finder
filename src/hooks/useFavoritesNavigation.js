import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

export function useFavoritesNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    searchTerm: contextSearchTerm, 
    fromRecipeId 
  } = useNavigation() || {};

  const handleBack = useCallback(() => {
    const effectiveSearchTerm = (location.state?.searchTerm && 
      typeof location.state.searchTerm === 'string')
      ? location.state.searchTerm 
      : contextSearchTerm || '';
    
    // Recipe detail has priority
    if (location.state?.from === 'recipeDetail') {
      const recipeId = location.state.recipeId || fromRecipeId;
      if (recipeId) {
        navigate(`/recipe/${recipeId}`, {
          state: {
            from: 'favorites',
            searchTerm: effectiveSearchTerm
          }
        });
        return;
      }
    }
    
    // Then try search
    if ((location.state?.from === 'search' || !location.state?.from) && effectiveSearchTerm) {
      navigate('/', { 
        state: { 
          preserveSearch: true, 
          searchTerm: effectiveSearchTerm,
          showHero: false
        } 
      });
      return;
    }
    
    // Default to home
    navigate('/');
  }, [location, contextSearchTerm, fromRecipeId, navigate]);

  return { handleBack };
}
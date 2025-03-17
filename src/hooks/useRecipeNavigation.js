import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRecipeNavigation = (recipe, location, navigationContext) => {
  const navigate = useNavigate();
  
  // Safely destructure with defaults
  const { 
    searchTerm: contextSearchTerm = '', 
    setSearchTerm,
    fromPage,
    setFromPage,
    fromRecipeId, 
    setFromRecipeId,
    originalFromPage,
    setOriginalFromPage
  } = navigationContext || {};

  // When recipe loads, update context
  useEffect(() => {
    if (recipe && recipe.id) {
      // Only call these functions if they exist
      if (setFromRecipeId) {
        setFromRecipeId(recipe.id);
      }
      
      // If we have a search term in location state, sync it to context
      if (location.state?.searchTerm && setSearchTerm) {
        setSearchTerm(location.state.searchTerm);
      }
      
      // Update fromPage in context if it came from location state
      if (location.state?.from && setFromPage) {
        setFromPage(location.state.from);
      }
      
      // Preserve the original source page if it exists
      if (location.state?.originalFromPage && setOriginalFromPage) {
        setOriginalFromPage(location.state.originalFromPage);
      }
    }
  }, [recipe, location.state, setFromRecipeId, setSearchTerm, setFromPage, setOriginalFromPage]);

  const handleBack = () => {
    const effectiveSearchTerm = 
      (location.state?.searchTerm && typeof location.state.searchTerm === 'string') 
        ? location.state.searchTerm 
        : contextSearchTerm || '';
    
    // Check for original source in this priority order
    const originPage = location.state?.originalFromPage || originalFromPage || location.state?.from || fromPage;
    
    if (originPage === 'favorites') {
      navigate('/favorites', {
        state: {
          returnToSearch: true,
          searchTerm: effectiveSearchTerm
        }
      });
    } else if (originPage === 'search' || originPage === 'home') {
      navigate('/', { 
        state: { 
          showHero: false, 
          preserveSearch: true,
          searchTerm: effectiveSearchTerm
        }
      });
    } else {
      navigate('/', { 
        state: { 
          showHero: !effectiveSearchTerm,
          preserveSearch: !!effectiveSearchTerm,
          searchTerm: effectiveSearchTerm
        }
      });
    }
  };

  const handleSurprise = async (fetchRandomRecipe) => {
    try {
      const randomRecipe = await fetchRandomRecipe();
      
      // Update context before navigation
      if (setSearchTerm && contextSearchTerm) {
        setSearchTerm(contextSearchTerm);
      }
      
      if (setFromPage) {
        setFromPage('recipeDetail');
      }
      
      navigate(`/recipe/${randomRecipe.id}`, { 
        state: {
          from: 'recipeDetail',
          searchTerm: contextSearchTerm || location.state?.searchTerm || ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleBack,
    handleSurprise
  };
};
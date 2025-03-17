import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { safeStorage } from '../utils/storage';

const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = safeStorage.getItem('recipeSearchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading search history:', err);
      return [];
    }
  });
  const [showHero, setShowHero] = useState(() => {
    // If coming back from recipe details, respect the saved state
    if (location.state && location.state.hasOwnProperty('showHero')) {
      return location.state.showHero;
    }
    // Otherwise default to true
    return true;
  });
  const [fromPage, setFromPage] = useState('');
  const [fromRecipeId, setFromRecipeId] = useState(null);
  const [originalFromPage, setOriginalFromPage] = useState(''); // Track the original source page

  // Handle search history updates
  const addToSearchHistory = (term) => {
    if (term.trim()) {
      const newHistory = [
        term,
        ...searchHistory.filter(item => item !== term)
      ].slice(0, 10); // Limit history
      
      setSearchHistory(newHistory);
      safeStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
    }
  };

  const clearSearchHistory = (term) => {
    let newHistory;
    
    if (term) {
      // Clear specific term
      newHistory = searchHistory.filter(item => item !== term);
    } else {
      // Clear all history
      newHistory = [];
    }
    
    setSearchHistory(newHistory);
    safeStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
  };

  // Navigation functions
  const goToHome = () => {
    navigate('/', { state: { showHero: true } });
    setShowHero(true);
  };

  const goToSearch = (term) => {
    setSearchTerm(term);
    setShowHero(false);
    
    if (term) {
      addToSearchHistory(term);
    }
    
    navigate('/', { 
      state: { 
        showHero: false,
        preserveSearch: true,
        searchTerm: term
      } 
    });
  };

  const goToRecipe = (id, options = {}) => {
    navigate(`/recipe/${id}`, {
      state: {
        from: options.from || 'search',
        searchTerm: options.searchTerm || searchTerm,
        recipeId: id
      }
    });
  };

  const goToFavorites = (options = {}) => {
    const stateToPass = {
      from: options.from || (location.pathname.includes('/recipe/') ? 'recipeDetail' : 'search'),
      searchTerm: options.searchTerm || searchTerm
    };
    
    if (options.from === 'recipeDetail' || location.pathname.includes('/recipe/')) {
      stateToPass.recipeId = options.recipeId || location.pathname.split('/recipe/')[1];
    }
    
    navigate('/favorites', { state: stateToPass });
  };

  const goBack = (defaultPath = '/') => {
    if (location.state && location.state.from) {
      const { from, searchTerm: prevSearchTerm } = location.state;
      
      if (from === 'recipeDetail' && location.state.recipeId) {
        navigate(`/recipe/${location.state.recipeId}`);
      } else if (from === 'search' && prevSearchTerm) {
        navigate('/', { 
          state: { 
            preserveSearch: true, 
            searchTerm: prevSearchTerm,
            showHero: false
          } 
        });
        setSearchTerm(prevSearchTerm);
      } else {
        navigate(defaultPath);
      }
    } else {
      navigate(defaultPath);
    }
  };

  // If preserving search from navigation
  useEffect(() => {
    if (location.state && location.state.preserveSearch && location.state.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);

  return (
    <NavigationContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchHistory,
      showHero,
      setShowHero,
      goToHome,
      goToSearch,
      goToRecipe,
      goToFavorites,
      goBack,
      addToSearchHistory,
      clearSearchHistory,
      fromPage,
      setFromPage,
      fromRecipeId,
      setFromRecipeId,
      originalFromPage,
      setOriginalFromPage
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
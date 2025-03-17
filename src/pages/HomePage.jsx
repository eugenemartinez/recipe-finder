import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePageTransition from '../components/common/HomePageTransition';
import SearchBar from '../components/search/SearchBar';
import DiscoverButton from '../components/search/DiscoverButton';
import HeroSection from '../components/common/HeroSection';
import HeroBackground from '../components/common/HeroBackground';
import SearchResults from '../components/search/SearchResults';
import MainLayout from '../layouts/MainLayout';
import { useTimerContext } from '../context/TimerContext';
import { useNavigation } from '../context/NavigationContext';
import { useSearch } from '../context/SearchContext';
import SurpriseButton from '../components/common/SurpriseButton';
import { useRandomRecipe } from '../hooks/useRandomRecipe';
import FavoritesButton from '../components/common/FavoritesButton';

/**
 * HomePage Component - Main landing page with search functionality
 */
const HomePage = () => {
  // All existing hooks and state remain unchanged
  const location = useLocation();
  
  // Context values
  const { setIsHeroVisible, setIsAppLoading } = useTimerContext();
  const { setFromPage, setOriginalFromPage } = useNavigation();
  
  // Search context
  const { 
    searchTerm, recipes, loading, error, showHero, setShowHero,
    activeTag, setActiveTag, allTags, searchHistory, filteredRecipes,
    handleSearch, handleClearHistory, handleClearError, isDiscoverMode,
    refreshDiscoverRecipes
  } = useSearch();

  // Random recipe hook
  const { getRandomRecipe } = useRandomRecipe();

  // All your existing refs and useEffects remain unchanged
  const processedStateRef = useRef(false);
  const lastSearchTermRef = useRef('');
  const isInitialRender = useRef(true);
  
  // Update navigation context
  useEffect(() => {
    if (setFromPage) setFromPage('search');
    if (setOriginalFromPage) setOriginalFromPage('search');
  }, [setFromPage, setOriginalFromPage]);

  // Handle URL state changes
  useEffect(() => {
    // Guard to prevent processing during initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (location.state?.preserveSearch) {
      setShowHero(false);
      
      // Skip search processing if skipSearch flag is true
      if (location.state.skipSearch === true) {
        return; // Exit early - don't trigger a new search
      }
      
      if (
        location.state.searchTerm && 
        location.state.searchTerm !== lastSearchTermRef.current && 
        !processedStateRef.current
      ) {
        lastSearchTermRef.current = location.state.searchTerm;
        processedStateRef.current = true;
        
        const timer = setTimeout(() => {
          handleSearch(location.state.searchTerm);
          
          setTimeout(() => {
            processedStateRef.current = false;
          }, 1000);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location.state, setShowHero, handleSearch]);

  // Sync hero visibility with timer context
  useEffect(() => {
    setIsHeroVisible(showHero);
  }, [showHero, setIsHeroVisible]);

  // Update global loading state
  useEffect(() => {
    if (typeof setIsAppLoading === 'function') {
      setIsAppLoading(loading);
      return () => setIsAppLoading(false);
    }
  }, [loading, setIsAppLoading]);

  // Existing handlers
  const handleDiscoverClick = () => {
    handleSearch("all");
  };
  
  const handleSurpriseClick = () => {
    getRandomRecipe();
  };

  // Enhanced animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const resultsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <MainLayout>
      <HomePageTransition showHero={showHero}>
        {/* Hero Background with AnimatePresence */}
        <AnimatePresence>
          {showHero && (
            <motion.div
              key="hero-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="z-0"
            >
              <HeroBackground />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={`w-full relative min-h-[80vh] ${!showHero ? 'mt-4' : ''}`}>
          {/* Hero Section with AnimatePresence */}
          <AnimatePresence mode="wait">
            {showHero && (
              <motion.div
                key="hero-section"
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <HeroSection className="hero-section" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content area */}
          <div className="w-full">
            {/* FIXED BACKGROUND - MODIFIED to prevent flash */}
            {/* Use AnimatePresence for smooth appearance/disappearance */}
            <AnimatePresence>
              {!showHero && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sticky top-0 z-10 pt-2 pb-0 bg-[#3D405B]" // Reduced padding from pt-4 pb-4 to pt-2 pb-2
                  style={{ 
                    position: 'sticky', 
                    top: 0,
                    width: '100%'
                  }}
                />
              )}
            </AnimatePresence>

            {/* SearchBar container - NO LAYOUT ANIMATION on container */}
            <div className="flex flex-col justify-center items-center w-full">
              {/* Only apply layout animation to search bar wrapper */}
              <motion.div 
                className="w-full md:w-3/4 lg:w-2/3"
                layout
                layoutId="search-bar-wrapper"
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 28,
                }}
                style={{ 
                  position: !showHero ? 'sticky' : 'relative', 
                  top: !showHero ? '16px' : 'auto', 
                  zIndex: 20,
                  // Add this to prevent any white background flashes
                  willChange: 'transform', // Optimize for animations
                  backfaceVisibility: 'hidden', // Prevent flashes
                  transformStyle: 'preserve-3d' // Better render layering
                }}
              >
                {/* Force the search bar to keep a consistent background */}
                <div className="bg-[#2D2A32] rounded-md" style={{ transform: 'translateZ(0)' }}> 
                  <SearchBar 
                    onSearch={handleSearch} 
                    searchPerformed={!showHero}
                    initialValue={searchTerm}
                    searchHistory={searchHistory}
                    onClearHistory={handleClearHistory}
                    allRecipes={recipes || []}
                  />
                </div>
              </motion.div>
              
              {/* Tablet/Desktop Action Buttons - Super-fast exit */}
              <AnimatePresence mode="sync">
                {showHero && (
                  <motion.div 
                    className="hidden md:flex justify-center gap-4 mt-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      enter: { delay: 0.2, duration: 0.4 },
                      exit: { duration: 0.05 } // Even faster exit
                    }}
                  >
                    {/* Custom expansion animation for SurpriseButton */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400, damping: 15 }
                      }}
                      className="w-44"
                    >
                      <SurpriseButton 
                        onClick={handleSurpriseClick} 
                        className="px-5 py-2.5 text-base w-full flex justify-center items-center"
                      />
                    </motion.div>
                    
                    <DiscoverButton 
                      onClick={handleDiscoverClick} 
                      isMobile={false}
                      className="w-44 flex justify-center items-center" 
                    />
                    
                    {/* Custom expansion animation for FavoritesButton */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400, damping: 15 }
                      }}
                      className="w-44"
                    >
                      <FavoritesButton 
                        size="lg" 
                        variant="homepage" 
                        className="w-full flex justify-center items-center" 
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Mobile Action Buttons - Super-fast exit */}
              <AnimatePresence mode="sync">
                {showHero && (
                  <motion.div 
                    className="md:hidden mt-16 mb-10 px-4 w-full flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      enter: { delay: 0.2, duration: 0.4 },
                      exit: { duration: 0.05 } // Even faster exit
                    }}
                  >
                    {/* Custom expansion animation for mobile SurpriseButton */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400, damping: 15 }
                      }}
                      className="w-1/2"
                    >
                      <SurpriseButton 
                        onClick={handleSurpriseClick} 
                        className="w-full text-sm h-10 mb-4 flex justify-center items-center"
                      />
                    </motion.div>
                    
                    <DiscoverButton 
                      onClick={handleDiscoverClick}
                      isMobile={true}
                      className="w-1/2 text-sm h-10 mb-4 flex justify-center items-center"
                    />
                    
                    {/* Custom expansion animation for mobile FavoritesButton */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 400, damping: 15 }
                      }}
                      className="w-1/2"
                    >
                      <FavoritesButton 
                        size="md" 
                        variant="homepage"
                        className="w-full text-sm h-10 flex justify-center items-center"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Search Results */}
            <AnimatePresence mode="wait">
              {!showHero && (
                <motion.div
                  key="search-results"
                  variants={resultsVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  <SearchResults
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    recipes={recipes}
                    filteredRecipes={filteredRecipes}
                    allTags={allTags}
                    activeTag={activeTag}
                    onTagClick={setActiveTag}
                    onClearError={handleClearError}
                    isDiscoverMode={isDiscoverMode}
                    onRefreshDiscover={refreshDiscoverRecipes}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </HomePageTransition>
    </MainLayout>
  );
};

export default HomePage;
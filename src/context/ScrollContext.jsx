import React, { createContext, useContext, useRef, useCallback } from 'react';

// Create the context
const ScrollContext = createContext();

// Toggle to enable/disable all console logs
const DEBUG_MODE = false;

/**
 * Provider component for managing scroll positions and loaded states across navigation
 */
export function ScrollProvider({ children }) {
  // Use refs to persist state without causing re-renders
  const scrollPositionsRef = useRef({});
  const loadedStatesRef = useRef({});
  
  // Helper for logging only in debug mode
  const log = useCallback((message, ...args) => {
    if (DEBUG_MODE) {
      console.log(`[ScrollContext] ${message}`, ...args);
    }
  }, []);
  
  /**
   * Save the current scroll position for a specific key
   * @param {string} key - Unique identifier for the view
   */
  const saveScrollPosition = useCallback((key) => {
    if (!key) return;
    
    const position = window.scrollY;
    if (position > 0) {
      scrollPositionsRef.current[key] = position;
      log(`Saved position ${position}px for ${key}`);
    }
  }, [log]);
  
  /**
   * Restore the scroll position for a specific key
   * @param {string} key - Unique identifier for the view
   */
  const restoreScrollPosition = useCallback((key) => {
    if (!key || !scrollPositionsRef.current[key]) return;
    
    // Use a small timeout to ensure the DOM has updated
    setTimeout(() => {
      window.scrollTo(0, scrollPositionsRef.current[key]);
      log(`Restored position ${scrollPositionsRef.current[key]}px for ${key}`);
    }, 100);
  }, [log]);
  
  /**
   * Save loaded items state for a specific key
   * @param {string} key - Unique identifier for the view
   * @param {object} state - The state to save (page, items)
   */
  const saveLoadedState = useCallback((key, state) => {
    if (!key) return;
    
    // Special case for null/undefined to clear the state
    if (state === null || state === undefined) {
      if (loadedStatesRef.current[key]) {
        delete loadedStatesRef.current[key];
        log(`Cleared loaded state for ${key}`);
      }
      return;
    }
    
    // Only update if there are changes to avoid unnecessary effects
    const currentState = loadedStatesRef.current[key];
    
    // Check if the state is the same (using signature or page/items.length)
    const hasChanged = 
      !currentState || 
      currentState.page !== state.page ||
      currentState.items?.length !== state.items?.length || 
      currentState.signature !== state.signature;
    
    if (hasChanged) {
      loadedStatesRef.current[key] = state;
      log(`Saved loaded state for ${key} (page ${state.page}, ${state.items?.length || 0} items)`);
    }
  }, [log]);
  
  /**
   * Get the loaded state for a specific key
   * @param {string} key - Unique identifier for the view
   * @returns {object|null} The saved state or null if not found
   */
  const getLoadedState = useCallback((key) => {
    return key ? loadedStatesRef.current[key] || null : null;
  }, []);
  
  /**
   * Clear all saved data for a specific key
   * @param {string} key - Unique identifier for the view
   */
  const clearSavedState = useCallback((key) => {
    if (!key) return;
    
    if (scrollPositionsRef.current[key]) {
      delete scrollPositionsRef.current[key];
    }
    
    if (loadedStatesRef.current[key]) {
      delete loadedStatesRef.current[key];
    }
    
    log(`Cleared saved state for ${key}`);
  }, [log]);

  // Context value - create it once and never change it
  const contextValue = useRef({
    saveScrollPosition,
    restoreScrollPosition,
    saveLoadedState,
    getLoadedState,
    clearSavedState
  }).current;

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}

/**
 * Hook for accessing the scroll context
 */
export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}
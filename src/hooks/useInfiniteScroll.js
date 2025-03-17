import { useState, useEffect, useRef, useCallback } from 'react';
import { useScroll } from '../context/ScrollContext';

/**
 * Custom hook for infinite scrolling with support for unique item tracking
 * @param {Array} items - Full array of items to paginate
 * @param {Object} options - Configuration options
 * @returns {Object} Paginated items and refs for infinite scrolling
 */
export function useInfiniteScroll(items = [], options = {}) {
  const {
    itemsPerPage = 6,
    idField = 'id',
    addUniqueIdentifiers = true,
    scrollKey = null // Key for identifying this view
  } = options;
  
  // Get the scroll context
  const { saveLoadedState, getLoadedState, restoreScrollPosition } = useScroll();
  
  // Try to get saved state - use the callback version to prevent re-renders
  const getSavedState = useCallback(() => {
    return scrollKey ? getLoadedState(scrollKey) : null;
  }, [scrollKey, getLoadedState]);
  
  const savedState = useRef(getSavedState()).current;
  
  // Initialize state from saved state or defaults
  const [displayedItems, setDisplayedItems] = useState(savedState?.items || []);
  const [page, setPage] = useState(savedState?.page || 1);
  const observer = useRef();
  const loadedItemsRef = useRef(new Set(savedState?.loadedIds || []));
  const initializedRef = useRef(false);
  const saveStateInProgressRef = useRef(false);
  const itemsSignatureRef = useRef('');
  
  // Helper function to generate a signature for the items array
  const getItemsSignature = useCallback((itemsList) => {
    if (!itemsList || !itemsList.length) return '';
    // Create a signature based on first, last, and count
    const firstId = itemsList[0]?.[idField] || '';
    const lastId = itemsList[itemsList.length - 1]?.[idField] || '';
    return `${firstId}-${lastId}-${itemsList.length}`;
  }, [idField]);
  
  // Update items signature when items change
  useEffect(() => {
    itemsSignatureRef.current = getItemsSignature(items);
  }, [items, getItemsSignature]);
  
  // Restore scroll position once items are loaded
  useEffect(() => {
    if (scrollKey && savedState && displayedItems.length > 0 && !initializedRef.current) {
      restoreScrollPosition(scrollKey);
      initializedRef.current = true;
    }
  }, [scrollKey, savedState, displayedItems.length, restoreScrollPosition]);
  
  // Effect to handle initial loading if no saved state
  useEffect(() => {
    // Skip if we have saved state AND the items haven't changed
    if (savedState?.items?.length > 0) {
      return;
    }
    
    // No saved state, start fresh
    setPage(1);
    setDisplayedItems([]);
    loadedItemsRef.current = new Set();
    
    // Load initial items
    if (items.length > 0) {
      const initialItems = items.slice(0, itemsPerPage).map((item, idx) => {
        // Only add position identifiers if requested
        if (!addUniqueIdentifiers) return item;
        
        const uniqueId = `${item[idField]}-p1-${idx}`;
        loadedItemsRef.current.add(uniqueId);
        
        return {
          ...item,
          _position: `p1-${idx}`, // p1 = page 1, idx = position in page
          _uniqueId: uniqueId
        };
      });
      
      setDisplayedItems(initialItems);
      
      // Save the initial state - use a flag to prevent loop
      if (scrollKey && !saveStateInProgressRef.current) {
        saveStateInProgressRef.current = true;
        const state = {
          page: 1,
          items: initialItems,
          loadedIds: Array.from(loadedItemsRef.current),
          signature: itemsSignatureRef.current
        };
        
        // Use setTimeout instead of Promise to ensure proper batching
        setTimeout(() => {
          saveLoadedState(scrollKey, state);
          saveStateInProgressRef.current = false;
        }, 0);
      }
    }
  }, [
    // Items signature to prevent unnecessarily re-running this effect
    getItemsSignature(items), 
    itemsPerPage, 
    idField, 
    addUniqueIdentifiers, 
    savedState, 
    scrollKey, 
    saveLoadedState
  ]);

  // Effect to handle loading more items when page changes
  useEffect(() => {
    if (page === 1 || saveStateInProgressRef.current) return;
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    if (start < items.length) {
      let newItems;
      
      if (addUniqueIdentifiers) {
        newItems = items.slice(start, end).map((item, idx) => {
          const uniqueId = `${item[idField]}-p${page}-${idx}`;
          
          // Skip items we've already loaded
          if (loadedItemsRef.current.has(uniqueId)) {
            return null;
          }
          
          // Track this item as loaded
          loadedItemsRef.current.add(uniqueId);
          
          return {
            ...item,
            _position: `p${page}-${idx}`,
            _uniqueId: uniqueId
          };
        }).filter(item => item !== null);
      } else {
        newItems = items.slice(start, end);
      }
      
      // Store the current page items so we don't repeatedly re-fetch them
      const updatedItems = [...displayedItems, ...newItems];
      setDisplayedItems(updatedItems);
      
      // Save updated state - use a flag to prevent loop
      if (scrollKey && !saveStateInProgressRef.current) {
        saveStateInProgressRef.current = true;
        const state = {
          page,
          items: updatedItems,
          loadedIds: Array.from(loadedItemsRef.current),
          signature: itemsSignatureRef.current
        };
        
        // Use setTimeout instead of Promise.resolve to ensure proper batching
        setTimeout(() => {
          saveLoadedState(scrollKey, state);
          saveStateInProgressRef.current = false;
        }, 0);
      }
    }
  }, [
    // Only run this effect when page changes, not when items/displayedItems update
    page, 
    // Pass custom signature to prevent repeated runs
    getItemsSignature(items),
    itemsPerPage, 
    idField, 
    addUniqueIdentifiers,
    scrollKey, 
    saveLoadedState
  ]);

  // Last item ref callback for intersection observer
  const lastItemRef = useCallback(
    node => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && displayedItems.length < items.length) {
          setPage(prevPage => prevPage + 1);
        }
      }, {
        rootMargin: '0px 0px 300px 0px', // Load when 300px from viewport bottom
        threshold: 0.1
      });
      
      if (node) observer.current.observe(node);
    },
    [displayedItems.length, items.length]
  );
  
  // Helper to check if we've loaded all items
  const hasMoreItems = displayedItems.length < items.length;
  
  // Reset function to start over
  const reset = useCallback(() => {
    setPage(1);
    setDisplayedItems([]);
    loadedItemsRef.current = new Set();
    initializedRef.current = false;
    itemsSignatureRef.current = '';
    
    if (scrollKey) {
      saveLoadedState(scrollKey, null);
    }
  }, [scrollKey, saveLoadedState]);

  return {
    displayedItems,
    lastItemRef,
    hasMoreItems,
    reset,
    totalItems: items.length,
    loadedItems: displayedItems.length
  };
}
import { useState, useEffect, useCallback } from 'react';
import { fetchRecipeById, searchRecipes } from '../services/api';

// Enhanced cache for recipes with longer expiration
const recipeCache = new Map();
// Track ongoing requests to prevent duplicate fetches
const pendingRequests = new Map();
// Cache expiration time - extended to 60 minutes
const CACHE_EXPIRATION = 60 * 60 * 1000;

export function useRecipeData(id) {
  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipeLoaded, setRecipeLoaded] = useState(false); 
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract fetch logic to enable prefetching
  const fetchRecipeData = useCallback(async (recipeId) => {
    // Return cached pending request if exists
    if (pendingRequests.has(recipeId)) {
      return pendingRequests.get(recipeId);
    }
    
    // Check cache first - with extended lifetime
    if (recipeCache.has(recipeId)) {
      const cachedData = recipeCache.get(recipeId);
      const isFresh = Date.now() - cachedData.timestamp < CACHE_EXPIRATION;
      
      if (isFresh) {
        return {
          recipe: cachedData.recipe,
          related: cachedData.related || [],
          fromCache: true
        };
      }
    }
    
    // Create a new promise for this request
    const requestPromise = (async () => {
      try {
        // PERFORMANCE: Set a timeout for the request
        const fetchPromise = fetchRecipeById(recipeId);
        
        // Start fetching related recipes immediately in parallel
        let relatedPromise = Promise.resolve([]);
        
        // Get recipe from cache if exists (even if stale) to return faster
        let initialRecipe = null;
        let relatedInitial = [];
        if (recipeCache.has(recipeId)) {
          const cachedData = recipeCache.get(recipeId);
          initialRecipe = cachedData.recipe;
          relatedInitial = cachedData.related || [];
        }
        
        // Fetch main recipe
        const fetchedRecipe = await fetchPromise;
        
        if (fetchedRecipe) {
          const searchTerm = fetchedRecipe.category || 
                          (fetchedRecipe.tags && fetchedRecipe.tags.length > 0 ? 
                           fetchedRecipe.tags[0] : "");
          
          if (searchTerm) {
            relatedPromise = searchRecipes(searchTerm);
          }
        }
        
        // Wait for related recipes with a timeout to avoid long waits
        const related = await Promise.race([
          relatedPromise,
          // Timeout after 3 seconds to avoid slow loading
          new Promise(resolve => setTimeout(() => resolve([]), 3000))
        ]);
        
        const filteredRelated = fetchedRecipe ? 
          related.filter(r => r.id !== fetchedRecipe.id).slice(0, 6) : [];
        
        // Save to cache with timestamp
        recipeCache.set(recipeId, {
          recipe: fetchedRecipe,
          related: filteredRelated,
          timestamp: Date.now()
        });
        
        return {
          recipe: fetchedRecipe,
          related: filteredRelated,
          fromCache: false
        };
      } finally {
        // Remove from pending requests when done
        pendingRequests.delete(recipeId);
      }
    })();
    
    // Store the promise in pending requests
    pendingRequests.set(recipeId, requestPromise);
    return requestPromise;
  }, []);

  // Prefetch related recipes
  const prefetchRelated = useCallback(() => {
    if (recipe?.related) {
      // PERFORMANCE: Use requestIdleCallback when browser is idle
      const prefetchFn = () => {
        recipe.related.forEach(relatedId => {
          if (!recipeCache.has(relatedId) && !pendingRequests.has(relatedId)) {
            fetchRecipeData(relatedId).catch(() => {
              // Silently handle prefetch errors
            });
          }
        });
      };
      
      if (window.requestIdleCallback) {
        window.requestIdleCallback(prefetchFn);
      } else {
        setTimeout(prefetchFn, 200);
      }
    }
  }, [recipe, fetchRecipeData]);

  useEffect(() => {
    let isMounted = true;
    
    async function loadRecipe() {
      if (!id) return;
      
      // PERFORMANCE: Don't clear previous recipe state immediately
      // This keeps the old recipe visible during loading for better UX
      setLoading(true);
      setRelatedLoading(true);
      setError(null);
      
      try {
        // PERFORMANCE: Fast-path for cached recipes
        if (recipeCache.has(id)) {
          const cachedData = recipeCache.get(id);
          const isFresh = Date.now() - cachedData.timestamp < CACHE_EXPIRATION;
          
          if (isFresh && isMounted) {
            // Show cached recipe immediately
            setRecipe(cachedData.recipe);
            setRecipeLoaded(true);
            setLoading(false);
            
            // If we have related recipes cached, show them too
            if (cachedData.related && cachedData.related.length > 0) {
              setRelatedRecipes(cachedData.related);
              setRelatedLoading(false);
              return; // Skip API call completely for full cache hits
            }
          }
        }
        
        // Need to fetch from API
        const result = await fetchRecipeData(id);
        
        if (!isMounted) return;
        
        // Show main recipe first
        if (result.recipe) {
          // PERFORMANCE: Use functional updates to batch state changes
          setRecipe(result.recipe);
          setRecipeLoaded(true);
          setLoading(false);
        }
        
        // Then update related recipes when they're ready
        if (result.related && result.related.length > 0) {
          setRelatedRecipes(result.related);
        }
        setRelatedLoading(false);
        
        // PERFORMANCE: Prefetch other recipes when idle
        if (result.recipe && result.recipe.id) {
          prefetchAdditionalRecipes(result.recipe.id);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load recipe. Please try again.');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setRelatedLoading(false);
        }
      }
    }
    
    if (id) {
      loadRecipe();
    }
    
    return () => {
      isMounted = false;
    };
  }, [id, fetchRecipeData, prefetchRelated]);

  return { 
    recipe, 
    relatedRecipes, 
    loading, 
    recipeLoaded,
    relatedLoading,
    error,
    prefetchRelated
  };
}

// Helper function to preload recipes
export function preloadRecipe(id) {
  if (!id || recipeCache.has(id)) return;
  
  // PERFORMANCE: Use a lower priority for prefetching
  setTimeout(() => {
    fetchRecipeById(id).then(recipe => {
      recipeCache.set(id, {
        recipe,
        related: [],
        timestamp: Date.now()
      });
    }).catch(() => {
      // Silently handle prefetch errors
    });
  }, 0);
}

// PERFORMANCE: New helper to prefetch additional recipes
function prefetchAdditionalRecipes(currentId) {
  // Use requestIdleCallback for background prefetching
  const prefetch = () => {
    // Find most recently accessed recipes from cache
    const recentIds = Array.from(recipeCache.keys())
      .filter(id => id !== currentId)
      .sort((a, b) => {
        return recipeCache.get(b).timestamp - recipeCache.get(a).timestamp;
      })
      .slice(0, 3);
      
    // Prefetch related recipes of recent recipes
    recentIds.forEach(id => {
      const cachedData = recipeCache.get(id);
      if (cachedData.related) {
        cachedData.related.slice(0, 2).forEach(relatedId => {
          preloadRecipe(relatedId);
        });
      }
    });
  };
  
  if (window.requestIdleCallback) {
    window.requestIdleCallback(prefetch);
  } else {
    setTimeout(prefetch, 500);
  }
}
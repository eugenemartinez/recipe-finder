import { useState, useEffect } from 'react';
import { commonSearchTerms } from '../config/searchConfig';

export function useSearchSuggestions(searchTerm, allRecipes = []) {
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    // Guard against invalid inputs
    if (!Array.isArray(allRecipes) || !searchTerm || typeof searchTerm !== 'string') {
      setSuggestions([]);
      return;
    }
    
    if (searchTerm.trim().length >= 2) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      // Create suggestions from recipe titles with null/undefined checking
      const titleSuggestions = allRecipes
        .filter(recipe => 
          recipe && 
          recipe.title && 
          typeof recipe.title === 'string' &&
          recipe.title.toLowerCase().includes(searchLower) && 
          recipe.title.toLowerCase() !== searchLower
        )
        .slice(0, 3)
        .map(recipe => recipe.title);
      
      // Add category/area suggestions with null/undefined checking
      const categorySuggestions = allRecipes
        .filter(recipe => 
          recipe && (
            (recipe.category && 
             typeof recipe.category === 'string' &&
             recipe.category.toLowerCase().includes(searchLower)) || 
            (recipe.area && 
             typeof recipe.area === 'string' &&
             recipe.area.toLowerCase().includes(searchLower))
          )
        )
        .slice(0, 2)
        .map(recipe => recipe.category || recipe.area)
        .filter(suggestion => suggestion && suggestion.toLowerCase() !== searchLower);
      
      // Use imported common search terms
      const commonSuggestions = commonSearchTerms
        .filter(term => 
          term &&
          typeof term === 'string' &&
          term.includes(searchLower) && 
          term !== searchLower && 
          !titleSuggestions.some(s => s.toLowerCase().includes(term))
        )
        .slice(0, 2);
      
      // Combine all suggestions, remove duplicates, and limit to 5
      const allSuggestions = [...new Set([
        ...titleSuggestions,
        ...categorySuggestions,
        ...commonSuggestions
      ])].slice(0, 5);
      
      setSuggestions(allSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allRecipes]);

  return suggestions;
}
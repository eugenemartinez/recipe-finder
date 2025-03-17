import { useState, useEffect } from 'react';

export function useRecipeTags(recipes) {
  const [activeTag, setActiveTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (recipes.length > 0) {
      const tagSet = new Set();
      
      recipes.forEach(recipe => {
        if (recipe.tags && Array.isArray(recipe.tags)) {
          recipe.tags.forEach(tag => tagSet.add(tag));
        }
        if (recipe.category) tagSet.add(recipe.category);
        if (recipe.area) tagSet.add(recipe.area);
      });
      
      setAllTags(Array.from(tagSet).sort());
    }
  }, [recipes]);

  const getFilteredRecipes = () => {
    return activeTag 
      ? recipes.filter(recipe => 
          (recipe.tags && recipe.tags.includes(activeTag)) ||
          recipe.category === activeTag ||
          recipe.area === activeTag
        )
      : recipes;
  };

  return { activeTag, setActiveTag, allTags, getFilteredRecipes };
}
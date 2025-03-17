const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const fetchRandomRecipe = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/random.php`);
    const data = await response.json();
    return transformRecipeData(data.meals[0]);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    throw error;
  }
};

export const fetchRecipeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? transformRecipeData(data.meals[0]) : null;
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    throw error;
  }
};

// Optimized approach that combines API calls

export const searchRecipes = async (query) => {
  try {
    const normalizedQuery = query.trim().toLowerCase();
    let results = new Map(); // Use a Map to deduplicate recipes by ID
    
    // 1. Try name search first (this typically gives us the most relevant results)
    const nameResponse = await fetch(`${API_BASE_URL}/search.php?s=${query}`);
    const nameData = await nameResponse.json();
    
    if (nameData.meals) {
      nameData.meals.forEach(meal => {
        results.set(meal.idMeal, transformRecipeData(meal));
      });
    }
    
    // 2. Make parallel requests for category, area, and ingredient searches
    const [categoryData, areaData, ingredientData] = await Promise.all([
      // Category search
      fetch(`${API_BASE_URL}/filter.php?c=${query}`)
        .then(res => res.json())
        .catch(() => ({ meals: null })),
      
      // Area/cuisine search
      fetch(`${API_BASE_URL}/filter.php?a=${query}`)
        .then(res => res.json())
        .catch(() => ({ meals: null })),
      
      // Ingredient search
      fetch(`${API_BASE_URL}/filter.php?i=${query}`)
        .then(res => res.json())
        .catch(() => ({ meals: null }))
    ]);
    
    // 3. Collect all the meal IDs we need to fetch details for
    const mealsToFetch = [];
    
    // Add category results
    if (categoryData.meals) {
      // Don't limit to just 5 results - get more (but not all to avoid performance issues)
      categoryData.meals.slice(0, 20).forEach(meal => {
        if (!results.has(meal.idMeal)) {
          mealsToFetch.push(meal.idMeal);
        }
      });
    }
    
    // Add area results
    if (areaData.meals) {
      areaData.meals.slice(0, 20).forEach(meal => {
        if (!results.has(meal.idMeal) && !mealsToFetch.includes(meal.idMeal)) {
          mealsToFetch.push(meal.idMeal);
        }
      });
    }
    
    // Add ingredient results
    if (ingredientData.meals) {
      ingredientData.meals.slice(0, 20).forEach(meal => {
        if (!results.has(meal.idMeal) && !mealsToFetch.includes(meal.idMeal)) {
          mealsToFetch.push(meal.idMeal);
        }
      });
    }
    
    // 4. Fetch all needed recipe details in parallel batches (to avoid too many simultaneous requests)
    if (mealsToFetch.length > 0) {
      // Process in batches of 10 to avoid overwhelming the API
      const batchSize = 10;
      for (let i = 0; i < mealsToFetch.length; i += batchSize) {
        const batch = mealsToFetch.slice(i, i + batchSize);
        const detailedRecipes = await Promise.all(
          batch.map(id => fetchRecipeById(id))
        );
        
        detailedRecipes.forEach(recipe => {
          if (recipe) {
            results.set(recipe.id, recipe);
          }
        });
      }
    }
    
    // 5. Also search for tag matches in the results we already have
    // This helps find matches in recipes we already fetched without additional API calls
    const existingRecipes = Array.from(results.values());
    for (const recipe of existingRecipes) {
      if (recipe.tags && Array.isArray(recipe.tags)) {
        const hasMatchingTag = recipe.tags.some(tag => 
          tag.toLowerCase().includes(normalizedQuery)
        );
        
        if (hasMatchingTag) {
          // The recipe is already in results, we're just ensuring we check tags too
          continue;
        }
      }
    }
    
    // Convert Map back to array
    const finalResults = Array.from(results.values());
    
    return finalResults;
  } catch (error) {
    console.error(`Error searching for recipes with query "${query}":`, error);
    throw error;
  }
};

export const fetchRecipesByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals ? data.meals.map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      // Note: This endpoint doesn't return full details, so we'll need to fetch them separately
    })) : [];
  } catch (error) {
    console.error(`Error fetching recipes for category "${category}":`, error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories ? data.categories.map(category => ({
      id: category.idCategory,
      name: category.strCategory,
      image: category.strCategoryThumb,
      description: category.strCategoryDescription
    })) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch all recipes for discover feature with enhanced variety
 * @param {number} limit - Maximum number of recipes to fetch 
 * @returns {Promise<Array>} Array of transformed recipe objects
 */
export async function fetchAllRecipes(limit = 150) { // Increased from 100
  try {
    // First try empty search which gives the most recipes in one call
    const response = await fetch(`${API_BASE_URL}/search.php?s=`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await response.json();
    let recipes = data.meals || [];
    
    // Transform the recipes
    const transformedRecipes = recipes.map(transformRecipeData);
    
    // If we didn't get enough recipes or want more variety, fetch some by first letter
    if (transformedRecipes.length < limit) {
      // Get random letters to increase variety
      const letters = ['a', 'b', 'c', 'm', 's', 'p'];
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      
      try {
        const letterResponse = await fetch(`${API_BASE_URL}/search.php?f=${randomLetter}`);
        const letterData = await letterResponse.json();
        
        if (letterData.meals) {
          // Transform these recipes too
          const letterRecipes = letterData.meals.map(transformRecipeData);
          
          // Add new unique recipes
          const existingIds = new Set(transformedRecipes.map(r => r.id));
          for (const recipe of letterRecipes) {
            if (!existingIds.has(recipe.id)) {
              transformedRecipes.push(recipe);
              existingIds.add(recipe.id);
            }
          }
        }
      } catch (err) {
        // Just log the error but continue with what we have
        console.error('Error fetching additional recipes:', err);
      }
    }
    
    return transformedRecipes;
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
}

// Helper function to transform API data into our app's format
const transformRecipeData = (meal) => {
  // Extract ingredients and measures
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
    }
  }
  
  // Extract tags
  const tags = meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [];
  
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory || '',
    area: meal.strArea || '',
    instructions: meal.strInstructions,
    image: meal.strMealThumb,
    video: meal.strYoutube ? meal.strYoutube.replace('watch?v=', 'embed/') : '',
    ingredients,
    tags: tags.length > 0 ? tags : [meal.strCategory],
  };
};
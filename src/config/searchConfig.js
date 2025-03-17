export const searchTermsByCategory = {
  meats: ['chicken', 'beef', 'pork', 'turkey', 'lamb'],
  diets: ['vegetarian', 'vegan', 'keto', 'low-carb', 'gluten-free'],
  meals: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'],
  cuisines: ['italian', 'mexican', 'chinese', 'indian', 'japanese']
};

export const commonSearchTerms = Object.values(searchTermsByCategory).flat();
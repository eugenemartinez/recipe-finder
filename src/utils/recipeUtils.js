/**
 * Randomizes an array using the Fisher-Yates shuffle algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
export function shuffleArray(array) {
  // Create a copy to avoid mutating the original array
  const newArray = [...array];
  
  // Fisher-Yates shuffle algorithm
  for (let i = newArray.length - 1; i > 0; i--) {
    // Generate random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at indices i and j
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
}
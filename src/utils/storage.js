/**
 * Safe wrapper for localStorage operations that handles errors and edge cases
 */
export const safeStorage = {
  /**
   * Safely retrieves a value from localStorage
   * @param {string} key - The key to retrieve
   * @param {any} defaultValue - Default value to return if retrieval fails
   * @returns {any} The retrieved value or defaultValue
   */
  getItem: (key, defaultValue = null) => {
    if (!key) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.error(`Error retrieving "${key}" from localStorage:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Safely stores a value in localStorage
   * @param {string} key - The key to store under
   * @param {any} value - The value to store
   * @returns {boolean} Success status
   */
  setItem: (key, value) => {
    if (!key) return false;
    
    try {
      localStorage.setItem(key, value);
      // Verify the value was stored correctly
      const stored = localStorage.getItem(key);
      return stored === value;
    } catch (error) {
      console.error(`Error storing "${key}" in localStorage:`, error);
      return false;
    }
  },
  
  /**
   * Safely removes an item from localStorage
   * @param {string} key - The key to remove
   * @returns {boolean} Success status
   */
  removeItem: (key) => {
    if (!key) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing "${key}" from localStorage:`, error);
      return false;
    }
  },
  
  /**
   * Safely checks if localStorage is available
   * @returns {boolean} Whether localStorage is available
   */
  isAvailable: () => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
};
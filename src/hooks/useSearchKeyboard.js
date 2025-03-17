import { useState, useEffect } from 'react';

export function useSearchKeyboard(isActive, suggestions, history, handleSearch, handleSuggestion, handleHistory) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Reset index when dropdown closes
  useEffect(() => {
    if (!isActive) setSelectedIndex(-1);
  }, [isActive]);
  
  const handleKeyDown = (event) => {
    if (!isActive) return;
    
    const totalItems = suggestions.length + history.length;
    if (totalItems === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          return nextIndex >= totalItems ? 0 : nextIndex;
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prevIndex => {
          const nextIndex = prevIndex - 1;
          return nextIndex < 0 ? totalItems - 1 : nextIndex;
        });
        break;
      case 'Enter':
        if (selectedIndex !== -1) {
          event.preventDefault();
          if (selectedIndex < suggestions.length) {
            handleSuggestion(suggestions[selectedIndex]);
          } else {
            const historyIndex = selectedIndex - suggestions.length;
            handleHistory(history[historyIndex]);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && selectedIndex === -1) {
      handleSearch();
    }
  };
  
  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleKeyPress
  };
}
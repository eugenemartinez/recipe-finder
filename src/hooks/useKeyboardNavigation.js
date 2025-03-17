import { useState, useEffect } from 'react';

export const useKeyboardNavigation = (isActive, dropdownRef, totalItems) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selectedIndex when dropdown visibility changes
  useEffect(() => {
    if (!isActive) {
      setSelectedIndex(-1);
    }
  }, [isActive]);

  // Auto-scrolling logic
  useEffect(() => {
    if (selectedIndex !== -1 && dropdownRef.current) {
      // Find the currently selected element
      const selectedElement = dropdownRef.current.querySelector(`[aria-selected="true"]`);
      
      if (selectedElement) {
        // Calculate if element is in view
        const containerRect = dropdownRef.current.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();
        
        const isAboveView = elementRect.top < containerRect.top;
        const isBelowView = elementRect.bottom > containerRect.bottom;
        
        // Scroll only if element is not fully in view
        if (isAboveView || isBelowView) {
          selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: isAboveView ? 'start' : 'end'
          });
        }
      }
    }
  }, [selectedIndex, dropdownRef]);

  const handleKeyDown = (event, callbacks) => {
    if (!isActive) return;
    
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
          if (selectedIndex < callbacks.suggestionsLength) {
            callbacks.onSuggestionSelect(selectedIndex);
          } else {
            const historyIndex = selectedIndex - callbacks.suggestionsLength;
            callbacks.onHistorySelect(historyIndex);
          }
        } else if (callbacks.onSubmit) {
          // New case: if no item is selected, submit the form
          callbacks.onSubmit();
        }
        break;
        
      case 'Escape':
        callbacks.onEscape();
        break;
    }
  };

  return { selectedIndex, setSelectedIndex, handleKeyDown };
};
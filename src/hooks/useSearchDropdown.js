import { useState, useEffect, useRef } from 'react';

export function useSearchDropdown() {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    isActive,
    setIsActive,
    dropdownRef,
    inputRef
  };
}
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { useSearchDropdown } from '../../hooks/useSearchDropdown';
import { useNavigation } from '../../context/NavigationContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import SearchDropdown from './SearchDropdown';
import SearchButton from '../common/SearchButton';

/**
 * SearchInput component handles the actual input field with its event handlers
 */
const SearchInput = ({ 
  inputRef, 
  searchTerm, 
  handleInputChange, 
  handleKeyboardNav, 
  handleInputFocus,
  isActive
}) => (
  <input
    ref={inputRef}
    type="text"
    value={searchTerm}
    onChange={handleInputChange}
    onKeyDown={handleKeyboardNav}
    onFocus={handleInputFocus}
    onClick={handleInputFocus}
    placeholder="Search for recipes..."
    className="py-2 px-3 border border-[#3D405B] 
              focus:outline-none focus:ring-2 focus:ring-[#81B29A] 
              focus:border-[#81B29A] bg-[#3D405B] text-[#F4F1DE] 
              w-full placeholder-[#E6DFD9] placeholder-opacity-70 
              focus:placeholder-opacity-90 rounded-l-md
              transition-all duration-200 ease-in-out"
    aria-label="Search for recipes"
    aria-expanded={isActive}
    aria-controls="search-dropdown"
    aria-autocomplete="list"
    autoComplete="off"
  />
);

/**
 * Main SearchBar component that handles search functionality
 */
const SearchBar = ({ 
  onSearch, 
  searchPerformed,
  initialValue = '',
  searchHistory = [],
  onClearHistory,
  allRecipes = []
}) => {
  // ===== STATE & HOOKS =====
  const { searchTerm: contextSearchTerm, setSearchTerm: setContextSearchTerm } = useNavigation() || {};
  const [searchTerm, setSearchTerm] = useState(contextSearchTerm || initialValue);
  
  const { isActive, setIsActive, dropdownRef, inputRef } = useSearchDropdown();
  const suggestions = useSearchSuggestions(searchTerm, allRecipes);
  const totalItems = suggestions.length + searchHistory.length;
  const { selectedIndex, handleKeyDown } = useKeyboardNavigation(isActive, dropdownRef, totalItems);
  
  // Track if the user is actively editing
  const isEditingRef = useRef(false);
  const lastContextTermRef = useRef(contextSearchTerm);
  
  // ===== SYNC WITH EXTERNAL DATA =====
  useEffect(() => {
    // Only update from context if we're not editing AND the context actually changed
    if (
      contextSearchTerm && 
      !isEditingRef.current && 
      contextSearchTerm !== searchTerm &&
      contextSearchTerm !== lastContextTermRef.current
    ) {
      setSearchTerm(contextSearchTerm);
    }
    
    lastContextTermRef.current = contextSearchTerm;
  }, [contextSearchTerm, searchTerm]);
  
  useEffect(() => {
    // Only update from initialValue on first render or explicit prop changes
    if (initialValue && initialValue !== searchTerm && !isEditingRef.current) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  // ===== EVENT HANDLERS =====
  const handleInputChange = useCallback((e) => {
    isEditingRef.current = true;
    setSearchTerm(e.target.value);
    
    if (!isActive) {
      setIsActive(true);
    }
    
    // Reset the editing flag after a short delay
    setTimeout(() => {
      isEditingRef.current = false;
    }, 100);
  }, [isActive, setIsActive]);

  const handleInputFocus = useCallback(() => {
    setIsActive(true);
  }, [setIsActive]);

  const handleSearch = useCallback((e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      if (setContextSearchTerm) setContextSearchTerm(searchTerm);
      onSearch(searchTerm);
      setIsActive(false); // Close the dropdown when search is performed
    }
  }, [searchTerm, setContextSearchTerm, onSearch, setIsActive]);

  const handleKeyboardNav = useCallback((event) => {
    handleKeyDown(event, {
      suggestionsLength: suggestions.length,
      onSuggestionSelect: (index) => handleSuggestionClick(suggestions[index]),
      onHistorySelect: (index) => handleHistoryItemClick(searchHistory[index]),
      onEscape: () => setIsActive(false),
      onSubmit: () => handleSearch() // Handle Enter when no item is selected
    });
  }, [handleKeyDown, suggestions, searchHistory, setIsActive, handleSearch]);

  const handleHistoryItemClick = useCallback((term) => {
    setSearchTerm(term);
    if (setContextSearchTerm) setContextSearchTerm(term);
    onSearch(term);
    setIsActive(false); // Close the dropdown when a history item is clicked
  }, [setContextSearchTerm, onSearch, setIsActive]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchTerm(suggestion);
    if (setContextSearchTerm) setContextSearchTerm(suggestion);
    onSearch(suggestion);
    setIsActive(false); // Close the dropdown when a suggestion is clicked
  }, [setContextSearchTerm, onSearch, setIsActive]);

  const handleClearHistoryItem = useCallback((e, term) => {
    e.stopPropagation();
    onClearHistory(term);
  }, [onClearHistory]);

  const handleClearAllHistory = useCallback((e) => {
    e.stopPropagation();
    onClearHistory();
  }, [onClearHistory]);

  // ===== DROPDOWN COMPONENT =====
  const renderDropdown = useCallback(() => {
    if (!isActive) return null;
    
    return (
      <SearchDropdown
        dropdownRef={dropdownRef}
        suggestions={suggestions}
        searchHistory={searchHistory}
        searchTerm={searchTerm}
        selectedIndex={selectedIndex}
        onSuggestionClick={handleSuggestionClick}
        onHistoryItemClick={handleHistoryItemClick}
        onClearHistoryItem={handleClearHistoryItem}
        onClearAllHistory={handleClearAllHistory}
      />
    );
  }, [
    isActive, dropdownRef, suggestions, searchHistory, searchTerm, selectedIndex,
    handleSuggestionClick, handleHistoryItemClick, handleClearHistoryItem, handleClearAllHistory
  ]);

  // ===== SEARCH FORM CONTENT =====
  const renderSearchForm = (isMobile = false) => (
    <form onSubmit={handleSearch} className={isMobile ? "mb-0" : ""}>
      <div className="flex items-stretch relative">
        <div className="flex-grow relative">
          <SearchInput
            inputRef={inputRef}
            searchTerm={searchTerm}
            handleInputChange={handleInputChange}
            handleKeyboardNav={handleKeyboardNav}
            handleInputFocus={handleInputFocus}
            isActive={isActive}
          />
          {renderDropdown()}
        </div>
        <SearchButton 
          type="submit" 
          inSearchBar={true}
          className="rounded-r-md rounded-l-none" 
        />
      </div>
    </form>
  );

  // ===== SEARCH RESULTS PAGE LAYOUT =====
  if (searchPerformed) {
    return (
      <div className="w-full p-4 bg-[#2D2A32] rounded-lg">
        <form onSubmit={handleSearch} className="flex items-stretch relative">
          <div className="flex-grow relative">
            <SearchInput
              inputRef={inputRef}
              searchTerm={searchTerm}
              handleInputChange={handleInputChange}
              handleKeyboardNav={handleKeyboardNav}
              handleInputFocus={handleInputFocus}
              isActive={isActive}
            />
            {renderDropdown()}
          </div>
          <SearchButton 
            type="submit" 
            inSearchBar={true}
            className="rounded-r-md rounded-l-none" 
          />
        </form>
      </div>
    );
  }
  
  // ===== HOMEPAGE LAYOUT =====
  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      <div className="bg-[#2D2A32] p-4 rounded-lg shadow-lg w-full">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {renderSearchForm(true)}
        </div>

        {/* Tablet/Desktop Layout */}
        <div className="hidden md:block">
          {renderSearchForm(false)}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
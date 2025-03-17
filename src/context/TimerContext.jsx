import React, { createContext, useContext, useState } from 'react';

// Define default context values 
const defaultContextValues = {
  isHeroVisible: true,
  setIsHeroVisible: () => {},
  isAppLoading: false,
  setIsAppLoading: () => {}
};

// Create context with default values
const TimerContext = createContext(defaultContextValues);

export const TimerProvider = ({ children }) => {
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(false);
  
  // Create the value object with actual state and setters
  const contextValue = {
    isHeroVisible,
    setIsHeroVisible,
    isAppLoading,
    setIsAppLoading
  };
  
  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    console.warn('useTimerContext must be used within a TimerProvider');
    return defaultContextValues; // Fallback to defaults if context is undefined
  }
  return context;
};
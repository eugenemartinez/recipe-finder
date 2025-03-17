import React, { useRef, useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useTimer } from '../../hooks/useTimer';
import { useTimerSound } from '../../hooks/useTimerSound';
import { useTimerContext } from '../../context/TimerContext';
import { useLocation } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import CompactTimer from './CompactTimer';
import ExpandedTimer from './ExpandedTimer';
import { motion, AnimatePresence } from 'framer-motion'; // Add AnimatePresence

const CookingTimer = () => {
  const location = useLocation();
  const { isHeroVisible, isAppLoading } = useTimerContext();
  const { showNotification } = useNotification(); // Add this line
  
  // State variables
  const [showTimer, setShowTimer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [compactEditing, setCompactEditing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // Sound enabled by default
  
  const editInputRef = useRef(null);
  const compactEditInputRef = useRef(null);
  const timerRef = useRef(null);
  
  // Timer sound hook
  const { playTimerSound } = useTimerSound(soundEnabled);
  
  // Timer hook
  const {
    minutes,
    seconds,
    isRunning,
    isEditing,
    editValue,
    startTimer: originalStartTimer,
    pauseTimer: originalPauseTimer,
    resetTimer: originalResetTimer,
    adjustSeconds,
    startEditing,
    handleEditChange,
    handleEditSubmit,
    cancelEditing,
    setTimerEndCallback
  } = useTimer(5, 0);

  // Wrap timer functions with notifications
  const startTimer = () => {
    originalStartTimer();
    showNotification('Timer started', 'timer-start', 1500);
  };
  
  const pauseTimer = () => {
    originalPauseTimer();
    showNotification('Timer paused', 'timer-pause', 1500);
  };
  
  const resetTimer = () => {
    originalResetTimer();
    showNotification('Timer reset', 'timer-stop', 1500);
  };

  // Set up timer end callback
  useEffect(() => {
    setTimerEndCallback(() => {
      playTimerSound();
      showNotification('Timer complete!', 'timer-complete', 3000);
    });
  }, [playTimerSound, setTimerEndCallback, showNotification]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      if (!compactEditing) {
        setIsExpanded(true);
      }
      
      const inputRef = compactEditing ? compactEditInputRef : editInputRef;
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, compactEditing]);

  // Handle clicks outside timer panel to collapse it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && timerRef.current && !timerRef.current.contains(event.target)) {
        if (!isEditing) {
          setIsExpanded(false);
        }
      }
      
      if (compactEditing && !event.target.closest('.compact-edit-container')) {
        handleEditSubmit();
        setCompactEditing(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, isEditing, compactEditing, handleEditSubmit]);

  // Handle edit form submission with keyboard
  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
      if (compactEditing) {
        setCompactEditing(false);
      }
    } else if (e.key === 'Escape') {
      cancelEditing();
      if (compactEditing) {
        setCompactEditing(false);
      }
    }
  };

  // Determine if we should show the timer at all 
  const isHomePage = location.pathname === '/';
  const shouldShowTimerButton = 
    isRunning || // Always show if timer is running
    (!isAppLoading && (!isHomePage || (isHomePage && !isHeroVisible))); // Otherwise, check other conditions

  if (!shouldShowTimerButton) {
    return null;
  }

  // Use AnimatePresence to coordinate the transitions between states
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence mode="wait" initial={false}>
        {!showTimer ? (
          // Floating button view
          <motion.button
            key="floating-button"
            onClick={() => setShowTimer(true)}
            className="bg-[#F2CC8F] text-[#3D405B] p-4 rounded-full shadow-lg 
                     flex items-center justify-center hover:bg-[#E6C276] 
                     group cursor-pointer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
            exit={{ 
              scale: 0,
              opacity: 0,
              transition: { 
                duration: 0.2 
              }
            }}
            whileHover={{ 
              scale: 1.1, 
              y: -4,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            whileTap={{ 
              scale: 0.95, 
              y: 0,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
            aria-label="Show Cooking Timer"
          >
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 12 }}
              transition={{ duration: 0.3 }}
            >
              <FaClock className="text-xl" />
            </motion.div>
          </motion.button>
        ) : (
          // Timer view
          <motion.div 
            key="timer-container"
            ref={timerRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0,
              transition: { 
                duration: 0.2 
              }
            }}
          >
            <motion.div 
              className={`bg-[#2D2A32] rounded-lg shadow-xl border border-transparent hover:border-[#F2CC8F]/20
                         ${isExpanded ? 'p-4 min-w-[280px]' : 'p-3'}`}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              {!isExpanded ? (
                <CompactTimer
                  minutes={minutes}
                  seconds={seconds}
                  isRunning={isRunning}
                  isEditing={isEditing}
                  compactEditing={compactEditing}
                  setCompactEditing={setCompactEditing}
                  editValue={editValue}
                  handleEditChange={handleEditChange}
                  handleEditKeyDown={handleEditKeyDown}
                  handleEditSubmit={handleEditSubmit}
                  startEditing={startEditing}
                  startTimer={startTimer}
                  pauseTimer={pauseTimer}
                  compactEditInputRef={compactEditInputRef}
                  setIsExpanded={setIsExpanded}
                  setShowTimer={setShowTimer}
                />
              ) : (
                <ExpandedTimer
                  minutes={minutes}
                  seconds={seconds}
                  isRunning={isRunning}
                  isEditing={isEditing}
                  editValue={editValue}
                  handleEditChange={handleEditChange}
                  handleEditKeyDown={handleEditKeyDown}
                  handleEditSubmit={handleEditSubmit}
                  startEditing={startEditing}
                  adjustSeconds={adjustSeconds}
                  startTimer={startTimer}
                  pauseTimer={pauseTimer}
                  resetTimer={resetTimer}
                  editInputRef={editInputRef}
                  soundEnabled={soundEnabled}
                  setSoundEnabled={setSoundEnabled}
                  setIsExpanded={setIsExpanded}
                  setShowTimer={setShowTimer}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CookingTimer;
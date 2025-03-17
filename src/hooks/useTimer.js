import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialMinutes = 5, initialSeconds = 0) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(`${initialMinutes}:${initialSeconds.toString().padStart(2, '0')}`);
  
  // Ref to hold the timer end callback
  const timerEndCallbackRef = useRef(null);
  
  // Function to set the timer end callback
  const setTimerEndCallback = useCallback((callback) => {
    timerEndCallbackRef.current = callback;
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval);
          setIsRunning(false);
          
          // Call the end callback if it exists
          if (timerEndCallbackRef.current) {
            timerEndCallbackRef.current();
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  // Update edit value when time changes and not editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }
  }, [minutes, seconds, isEditing]);

  // Timer controls
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  };

  // Time adjustment function (30s increments)
  const adjustSeconds = (amount) => {
    if (!isRunning) {
      let newSeconds = seconds + amount;
      if (newSeconds < 0) {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(60 + newSeconds);
        } else {
          setSeconds(0);
        }
      } else if (newSeconds >= 60) {
        setMinutes(minutes + Math.floor(newSeconds / 60));
        setSeconds(newSeconds % 60);
      } else {
        setSeconds(newSeconds);
      }
    }
  };

  // Time editing functions
  const startEditing = () => {
    if (isRunning) return;
    setIsEditing(true);
  };

  const handleEditChange = (value) => {
    setEditValue(value);
  };

  const handleEditSubmit = () => {
    const timePattern = /^(\d{1,2}):(\d{1,2})$/;
    const match = editValue.match(timePattern);
    
    if (match) {
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      
      if (secs < 60) {
        setMinutes(mins);
        setSeconds(secs);
      }
    }
    
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
  };

  return {
    minutes,
    seconds,
    isRunning,
    isEditing,
    editValue,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustSeconds,
    startEditing,
    handleEditChange,
    handleEditSubmit,
    cancelEditing,
    setTimerEndCallback, // Add this to the returned object
  };
};
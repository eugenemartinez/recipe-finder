import { useRef, useCallback } from 'react';

export const useTimerSound = (enabled = true) => {
  const audioContextRef = useRef(null);
  
  // Function to create audio context when needed (to address autoplay policy)
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);
  
  // Function to play timer completion sound
  const playTimerSound = useCallback(() => {
    if (!enabled) return;
    
    try {
      const context = getAudioContext();
      
      // Play the ding sound 3 times
      const playDing = (delay = 0) => {
        // Create oscillator (sound source)
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Set parameters for a nice "ding" sound
        oscillator.type = 'sine'; // Sine wave for clean tone
        oscillator.frequency.value = 1000; // Higher frequency for bell-like sound
        
        // Envelope for the sound
        gainNode.gain.setValueAtTime(0, context.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + delay + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + delay + 0.5);
        
        // Start and stop the sound
        oscillator.start(context.currentTime + delay);
        oscillator.stop(context.currentTime + delay + 0.6);
      };
      
      // Play sequence of dings
      playDing(0);
      playDing(0.7);
      playDing(1.4);
    } catch (error) {
      console.error("Error playing timer sound:", error);
    }
  }, [enabled, getAudioContext]);

  return { playTimerSound };
};
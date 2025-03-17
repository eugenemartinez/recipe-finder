import React from 'react';
import { FaBell, FaBellSlash, FaCompress, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

const ExpandedTimer = ({
  minutes,
  seconds,
  isRunning,
  isEditing,
  editValue,
  handleEditChange,
  handleEditKeyDown,
  handleEditSubmit,
  startEditing,
  adjustSeconds,
  startTimer,
  pauseTimer,
  resetTimer,
  editInputRef,
  soundEnabled,
  setSoundEnabled,
  setIsExpanded,
  setShowTimer
}) => {
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex justify-between items-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.span 
          className="font-medium text-[#F4F1DE]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Cooking Timer
        </motion.span>
        <div className="flex space-x-2">
          {/* Sound button - keep all original classes */}
          <motion.button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1 rounded transition-all duration-300 
                      ${soundEnabled ? 'text-[#F2CC8F]' : 'text-[#777]'} 
                      hover:text-[#F2CC8F] cursor-pointer
                      hover:-translate-y-0.5 hover:shadow-sm
                      active:translate-y-0 active:shadow-none group`}
            whileTap={{ scale: 0.95 }}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            title={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {soundEnabled ? (
                <motion.div
                  key="bell-on"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <FaBell size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="bell-off"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <FaBellSlash size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          {/* Collapse button - keep all original classes */}
          <motion.button 
            onClick={() => setIsExpanded(false)}
            className="p-1 text-[#E6DFD9] hover:text-[#F4F1DE] cursor-pointer
                     rounded transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-sm
                     active:translate-y-0 active:shadow-none group"
            whileTap={{ scale: 0.95 }}
            aria-label="Collapse timer"
            title="Collapse timer"
          >
            <motion.div className="transition-transform duration-300 group-hover:scale-110">
              <FaCompress size={16} />
            </motion.div>
          </motion.button>
          
          {/* Close button - keep all original classes */}
          <motion.button 
            onClick={() => setShowTimer(false)}
            className="p-1 text-[#E07A5F] hover:text-red-400 cursor-pointer
                     rounded transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-sm
                     active:translate-y-0 active:shadow-none group"
            whileTap={{ scale: 0.95 }}
            aria-label="Hide timer"
            title="Hide timer"
          >
            <motion.div className="transition-transform duration-300 group-hover:scale-110">
              <FaTimes size={16} />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Timer display with -/+ buttons */}
      <motion.div 
        className="text-center mb-4 relative flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TimerDisplay
          minutes={minutes}
          seconds={seconds}
          isEditing={isEditing}
          isRunning={isRunning}
          editValue={editValue}
          handleEditChange={handleEditChange}
          handleEditKeyDown={handleEditKeyDown}
          handleEditSubmit={handleEditSubmit}
          startEditing={startEditing}
          adjustSeconds={adjustSeconds}
          editInputRef={editInputRef}
        />
      </motion.div>
      
      {/* Controls */}
      <motion.div 
        className="mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <TimerControls
          isRunning={isRunning}
          isEditing={isEditing}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
        />
      </motion.div>
    </motion.div>
  );
};

export default ExpandedTimer;
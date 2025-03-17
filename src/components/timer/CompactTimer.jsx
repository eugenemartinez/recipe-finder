import React from 'react';
import { FaClock, FaEdit, FaCheck, FaPlay, FaPause, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CompactTimer = ({
  minutes,
  seconds,
  isRunning,
  isEditing,
  compactEditing,
  setCompactEditing,
  editValue,
  handleEditChange,
  handleEditKeyDown,
  handleEditSubmit,
  startTimer,
  pauseTimer,
  compactEditInputRef,
  setIsExpanded,
  setShowTimer
}) => {
  const handleCompactEdit = () => {
    setCompactEditing(true);
    if (typeof startEditing === 'function') {
      startEditing();
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {compactEditing ? (
          <motion.div 
            key="edit-mode"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center compact-edit-container"
          >
            <motion.div 
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <FaClock className="text-[#F2CC8F] mr-2" />
            </motion.div>
            <div className="relative">
              <motion.input
                ref={compactEditInputRef}
                type="text"
                value={editValue}
                onChange={(e) => handleEditChange(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="font-mono text-xl text-[#F4F1DE] bg-[#3D405B] border border-[#81B29A] rounded px-2 py-0 w-24 text-center
                           focus:outline-none focus:ring-2 focus:ring-[#81B29A] transition-all duration-200"
                pattern="\d{1,2}:\d{1,2}"
                placeholder="MM:SS"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="display-mode"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center cursor-pointer group" 
            onClick={() => setIsExpanded(true)}
            title="Click to expand timer"
          >
            <motion.div 
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <FaClock className="text-[#F2CC8F] mr-2" />
            </motion.div>
            <motion.span 
              className="font-mono text-xl text-[#F4F1DE] group-hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center space-x-2 ml-4">
        <AnimatePresence mode="wait" initial={false}>
          {/* Edit/Confirm button */}
          {compactEditing ? (
            <motion.button 
              key="confirm-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                handleEditSubmit();
                setCompactEditing(false);
              }}
              className="p-2 bg-[#81B29A] text-[#F4F1DE] rounded-full cursor-pointer shadow-sm"
              aria-label="Confirm Edit"
            >
              <FaCheck size={14} />
            </motion.button>
          ) : (
            <motion.button 
              key="edit-button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={!isRunning ? { scale: 1.1, y: -2 } : {}}
              whileTap={!isRunning ? { scale: 0.95, y: 0 } : {}}
              transition={{ duration: 0.2 }}
              onClick={!isRunning ? handleCompactEdit : undefined}
              className={`p-2 bg-[#3D405B] text-[#F4F1DE] rounded-full shadow-sm
                          ${!isRunning ? "cursor-pointer" : "cursor-not-allowed"}`}
              aria-label="Edit Timer"
              disabled={isRunning}
            >
              <FaEdit size={14} className={isRunning ? "opacity-50" : ""} />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Start/Pause button */}
        {!compactEditing && (
          <AnimatePresence mode="wait" initial={false}>
            {isRunning ? (
              <motion.button 
                key="pause-button"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={pauseTimer}
                className="p-2 bg-[#F2CC8F] text-[#3D405B] rounded-full cursor-pointer shadow-sm"
                aria-label="Pause Timer"
              >
                <FaPause size={14} />
              </motion.button>
            ) : (
              <motion.button 
                key="play-button"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={!isEditing ? { scale: 1.1, y: -2 } : {}}
                whileTap={!isEditing ? { scale: 0.95, y: 0 } : {}}
                transition={{ duration: 0.2 }}
                onClick={!isEditing ? startTimer : undefined}
                className={`p-2 bg-[#81B29A] text-[#F4F1DE] rounded-full shadow-sm
                            ${!isEditing ? "cursor-pointer" : "cursor-not-allowed"}`}
                aria-label="Start Timer"
                disabled={isEditing}
              >
                <FaPlay size={14} className={isEditing ? "opacity-50" : ""} />
              </motion.button>
            )}
          </AnimatePresence>
        )}
        
        {/* Close button */}
        <motion.button 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowTimer(false)}
          className="p-2 bg-[#E07A5F] text-[#F4F1DE] rounded-full cursor-pointer shadow-sm"
          aria-label="Close Timer"
        >
          <FaTimes size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CompactTimer;
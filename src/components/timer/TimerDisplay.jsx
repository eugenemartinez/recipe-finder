import React from 'react';
import { FaEdit, FaPlus, FaMinus } from 'react-icons/fa';

const TimerDisplay = ({ 
  minutes,
  seconds,
  isEditing,
  isRunning,
  editValue,
  handleEditChange,
  handleEditKeyDown,
  handleEditSubmit,
  startEditing,
  adjustSeconds,
  editInputRef
}) => {
  if (isEditing) {
    return (
      <div className="inline-block relative">
        <input
          ref={editInputRef}
          type="text"
          value={editValue}
          onChange={(e) => handleEditChange(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleEditSubmit}
          className="text-2xl font-mono text-[#F4F1DE] bg-[#3D405B] border border-[#81B29A] rounded px-2 py-1 w-24 text-center
                    focus:outline-none focus:ring-2 focus:ring-[#81B29A] transition-all duration-200"
          pattern="\d{1,2}:\d{1,2}"
          placeholder="MM:SS"
        />
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center relative">
      <button 
        onClick={() => adjustSeconds(-30)}
        disabled={isRunning}
        className={`mr-3 p-2 rounded-full 
                  transition-all duration-300 group
                  ${isRunning 
                    ? 'bg-gray-600 opacity-50 cursor-pointer' 
                    : 'bg-[#E07A5F] hover:bg-[#D06A4F] cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm'}`}
        aria-label="Decrease time by 30 seconds"
      >
        <FaMinus size={12} className={`${!isRunning && 'transition-transform duration-300 group-hover:scale-110'}`} />
      </button>
      
      <span className="text-2xl font-mono text-[#F4F1DE]">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      
      <button 
        onClick={() => adjustSeconds(30)}
        disabled={isRunning}
        className={`ml-3 p-2 rounded-full 
                  transition-all duration-300 group
                  ${isRunning 
                    ? 'bg-gray-600 opacity-50 cursor-pointer' 
                    : 'bg-[#81B29A] hover:bg-[#6A967F] cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm'}`}
        aria-label="Increase time by 30 seconds"
      >
        <FaPlus size={12} className={`${!isRunning && 'transition-transform duration-300 group-hover:scale-110'}`} />
      </button>
      
      {!isRunning && (
        <button 
          onClick={startEditing}
          className="ml-3 text-[#81B29A] hover:text-[#6A967F] p-1 cursor-pointer
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:shadow-sm
                    active:translate-y-0 active:shadow-none
                    group"
          aria-label="Edit timer"
        >
          <FaEdit className="transition-transform duration-300 group-hover:scale-110" />
        </button>
      )}
    </div>
  );
};

export default TimerDisplay;
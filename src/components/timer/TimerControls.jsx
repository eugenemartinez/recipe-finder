import React from 'react';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

const TimerControls = ({ 
  isRunning,
  isEditing,
  startTimer,
  pauseTimer,
  resetTimer
}) => {
  return (
    <div className="flex justify-between gap-3">
      {isRunning ? (
        <button 
          onClick={pauseTimer}
          className="flex-1 px-4 py-2 bg-[#F2CC8F] text-[#3D405B] rounded 
                    flex items-center justify-center cursor-pointer
                    transition-all duration-300
                    hover:bg-[#E6C276] hover:-translate-y-0.5 hover:shadow-md
                    active:translate-y-0 active:shadow-sm
                    group"
        >
          <FaPause className="mr-2 transition-transform duration-300 group-hover:scale-110" /> Pause
        </button>
      ) : (
        <button 
          onClick={startTimer}
          disabled={isEditing}
          className="flex-1 px-4 py-2 bg-[#81B29A] text-[#F4F1DE] rounded 
                    flex items-center justify-center cursor-pointer
                    transition-all duration-300
                    hover:bg-[#6A967F] hover:-translate-y-0.5 hover:shadow-md
                    active:translate-y-0 active:shadow-sm
                    disabled:opacity-50 disabled:hover:bg-[#81B29A] disabled:hover:translate-y-0 
                    disabled:hover:shadow-none
                    group"
        >
          <FaPlay className="mr-2 transition-transform duration-300 group-hover:scale-110" /> Start
        </button>
      )}
      <button 
        onClick={resetTimer}
        className="flex-1 px-4 py-2 bg-[#E07A5F] text-[#F4F1DE] rounded 
                  flex items-center justify-center cursor-pointer
                  transition-all duration-300
                  hover:bg-[#D06A4F] hover:-translate-y-0.5 hover:shadow-md
                  active:translate-y-0 active:shadow-sm
                  group"
      >
        <FaStop className="mr-2 transition-transform duration-300 group-hover:scale-110" /> Reset
      </button>
    </div>
  );
};

export default TimerControls;
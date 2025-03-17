import React, { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

/**
 * ServingsAdjuster component with enhanced interactive elements
 * @param {number} initialServings - Starting number of servings
 * @param {Function} onChange - Callback when servings change
 */
const ServingsAdjuster = ({ initialServings = 4, onChange }) => {
  const [servings, setServings] = useState(initialServings);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);
  
  const updateServings = (newValue) => {
    setServings(newValue);
    setRecentlyUpdated(true);
    setTimeout(() => setRecentlyUpdated(false), 500);
    
    if (onChange) {
      onChange(newValue);
    }
  };
  
  return (
    <div className={`${recentlyUpdated ? 'animate-pulse' : ''} mb-2`}>
      {/* Top row with label and controls - always flex-row */}
      <div className="flex flex-row items-center mb-3">
        <span className="text-[#F4F1DE] text-sm mr-3">Adjust servings:</span>
        
        <div className="flex items-center">
          {/* +/- controls with enhanced hover effects */}
          <div className="flex items-center bg-[#2D2A32] rounded-lg overflow-hidden shadow-sm">
            <button 
              onClick={() => updateServings(Math.max(1, servings - 1))}
              className="px-3 py-1.5 text-[#F4F1DE] hover:bg-[#3D405B] hover:text-[#81B29A] 
                        active:bg-[#2D2A32] disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200 cursor-pointer"
              disabled={servings <= 1}
              aria-label="Decrease servings"
            >
              <FaMinus size={10} className="transition-transform hover:scale-110" />
            </button>
            <span className={`px-4 py-1 text-[#F4F1DE] font-medium min-w-[30px] text-center
                            ${recentlyUpdated ? 'text-[#81B29A]' : ''}
                            transition-colors duration-300`}>
              {servings}
            </span>
            <button 
              onClick={() => updateServings(servings + 1)}
              className="px-3 py-1.5 text-[#F4F1DE] hover:bg-[#3D405B] hover:text-[#81B29A] 
                        active:bg-[#2D2A32]
                        transition-all duration-200 cursor-pointer"
              aria-label="Increase servings"
            >
              <FaPlus size={10} className="transition-transform hover:scale-110" />
            </button>
          </div>
          
          {/* Preset buttons - Enhanced versions for tablet+ */}
          <div className="hidden sm:flex space-x-2 ml-3">
            {[2, 4, 6, 8].map(amount => (
              <button
                key={amount}
                onClick={() => updateServings(amount)}
                className={`px-3 py-1 min-w-[30px] text-center rounded-lg 
                          transition-all duration-200 cursor-pointer
                          hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${
                  servings === amount 
                    ? 'bg-[#81B29A] text-[#F4F1DE] shadow-sm' 
                    : 'bg-[#2D2A32] text-[#F4F1DE] hover:bg-[#3D405B]'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile-only preset buttons - Enhanced versions */}
      <div className="flex justify-start items-center sm:hidden">
        <div className="flex space-x-2 ml-2">
          {[2, 4, 6, 8].map(amount => (
            <button
              key={amount}
              onClick={() => updateServings(amount)}
              className={`px-3 py-1 min-w-[30px] text-center rounded-lg 
                        transition-all duration-200 cursor-pointer
                        hover:shadow-sm active:shadow-none ${
                servings === amount 
                  ? 'bg-[#81B29A] text-[#F4F1DE] shadow-sm' 
                  : 'bg-[#2D2A32] text-[#F4F1DE] hover:bg-[#3D405B]'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServingsAdjuster;
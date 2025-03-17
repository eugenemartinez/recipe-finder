import React, { useState, useEffect } from 'react';
import { FaHeart, FaHeartBroken, FaClock, FaStopwatch, FaPause, FaStop } from 'react-icons/fa';

const ToastNotification = ({ 
  message, 
  type = 'success', 
  duration = 2000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Fade in immediately
    setIsVisible(true);
    
    // Set timeout to fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for animation to finish before unmounting
      setTimeout(() => onClose(), 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'favorite-added':
        return <FaHeart className="text-[#E07A5F]" />;
      case 'favorite-removed':
        return <FaHeartBroken className="text-[#E07A5F]" />;
      case 'timer-start':
        return <FaClock className="text-[#F2CC8F]" />;
      case 'timer-pause':
        return <FaPause className="text-[#F2CC8F]" />;
      case 'timer-stop':
        return <FaStop className="text-[#F2CC8F]" />;
      case 'timer-complete':
        return <FaStopwatch className="text-[#81B29A]" />;
      case 'success':
        return <FaClock className="text-[#81B29A]" />;
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'favorite-added':
      case 'favorite-removed':
        return 'bg-[#2D2A32]';
      case 'timer-start':
      case 'timer-pause':
      case 'timer-stop':
      case 'timer-complete':
        return 'bg-[#3D405B]';
      case 'success':
        return 'bg-[#81B29A]';
      case 'error':
        return 'bg-[#E07A5F]';
      default:
        return 'bg-[#2D2A32]';
    }
  };

  return (
    <div 
      className={`fixed z-50 top-6 left-1/2 transform -translate-x-1/2 
                 ${getBgColor()} text-[#F4F1DE] px-4 py-3 rounded-md shadow-lg
                 flex items-center space-x-2
                 transition-all duration-300
                 ${isVisible 
                   ? 'opacity-100 translate-y-0' 
                   : 'opacity-0 -translate-y-4'}`}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export default ToastNotification;
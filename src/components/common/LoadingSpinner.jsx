import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#81B29A] border-t-[#E07A5F] rounded-full animate-spin"></div>
      <span className="ml-3 text-lg text-[#F4F1DE]">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
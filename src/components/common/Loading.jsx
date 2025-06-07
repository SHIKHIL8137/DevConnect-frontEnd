import React from 'react';

const SimpleStylishRing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 flex items-center justify-center">
      <div className="text-center">
        {/* Main Ring Loader */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer glow ring */}
          <div className="absolute inset-0 border-2 border-sky-200 rounded-full animate-ping opacity-30"></div>
          
          {/* Main spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-sky-500 border-r-sky-400 rounded-full animate-spin"></div>
          
          {/* Inner accent ring */}
          <div className="absolute inset-2 border-2 border-sky-100 rounded-full animate-pulse"></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-xl font-light text-sky-800 mb-3 animate-pulse">Loading</h2>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStylishRing;
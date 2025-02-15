import React from 'react';
import { Bot } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Bot className="h-12 w-12 text-indigo-600 animate-bounce" />
        <span className="mt-4 text-indigo-600 font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
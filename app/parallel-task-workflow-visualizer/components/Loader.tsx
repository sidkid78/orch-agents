
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-600">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
      <p className="text-lg font-semibold text-gray-300">Processing your query...</p>
      <p className="text-gray-400 mt-1">{message}</p>
    </div>
  );
};

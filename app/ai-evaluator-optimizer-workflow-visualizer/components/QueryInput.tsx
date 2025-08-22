
import React from 'react';
import { SparklesIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Start a New Workflow</h2>
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your request... e.g., 'Draft a marketing email for our new product launch.'"
          className="w-full h-32 p-4 bg-gray-900/50 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-200 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !query.trim()}
          className="absolute bottom-4 right-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-5 h-5 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QueryInput;

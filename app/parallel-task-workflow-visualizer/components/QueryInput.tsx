
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a complex query, e.g., 'Analyze the impact of AI on the future of software development...'"
        disabled={isLoading}
        rows={3}
        className="w-full p-4 pr-16 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none transition-all duration-200 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        aria-label="Submit Query"
      >
        <SendIcon className="h-5 w-5 text-white" />
      </button>
    </form>
  );
};

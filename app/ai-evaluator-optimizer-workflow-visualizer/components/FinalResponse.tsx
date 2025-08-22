
import React from 'react';
import { CheckCircleIcon } from './Icons';

interface FinalResponseProps {
  response: string;
}

const FinalResponse: React.FC<FinalResponseProps> = ({ response }) => {
  const formattedResponse = response.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
  ));

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-green-700 animate-fade-in">
      <div className="flex items-center mb-4">
        <CheckCircleIcon className="w-7 h-7 text-green-400 mr-3" />
        <h2 className="text-xl font-semibold text-green-300">Final Refined Response</h2>
      </div>
      <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
        {formattedResponse}
      </div>
    </div>
  );
};

export default FinalResponse;

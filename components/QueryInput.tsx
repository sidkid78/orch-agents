
import React, { useState } from 'react';
import Spinner from '../components/Spinner';

interface QueryInputProps {
    onSubmit: (query: string) => void;
    isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSubmit(query.trim());
        }
    };

    const exampleQueries = [
        "Develop a marketing campaign for a new brand of eco-friendly sneakers.",
        "Write a short sci-fi story about a sentient planet and create a theme song for it.",
        "Analyze Q3 sales data, identify top 3 performing products, and draft an email to the sales team."
    ];

    const handleExampleClick = (exampleQuery: string) => {
        setQuery(exampleQuery);
    };

    return (
        <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">1. Enter Your Complex Query</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Plan a 3-day educational trip to Washington D.C. for a middle school history class, including a budget and itinerary."
                    className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-gray-200 placeholder-gray-500"
                    disabled={isLoading}
                />
                <div className="mt-3 text-xs text-gray-400">
                    <p className="font-semibold mb-1">Or try an example:</p>
                    <div className="flex flex-wrap gap-2">
                        {exampleQueries.map((ex, idx) => (
                           <button key={idx} type="button" onClick={() => handleExampleClick(ex)} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors disabled:opacity-50" disabled={isLoading}>
                               {ex.split(" ")[0]} {ex.split(" ")[1]}...
                           </button>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={isLoading || !query.trim()}
                >
                    {isLoading ? <><Spinner className="mr-2" /> Processing...</> : 'Execute Workflow'}
                </button>
            </form>
        </div>
    );
};

export default QueryInput;

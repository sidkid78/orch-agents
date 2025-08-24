"use client";
import React, { useState, useCallback } from 'react';
import { QueryInput } from './components/QueryInput';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { Loader } from './components/Loader';
import { AgentResponse } from './types';
import { runParallelWorkflow } from './services/geminiService';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [finalResponse, setFinalResponse] = useState<string | null>(null);
  const [intermediateSteps, setIntermediateSteps] = useState<AgentResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateLoadingMessage = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  const handleSubmit = async (userQuery: string) => {
    if (!userQuery.trim()) {
      setError("Please enter a query.");
      return;
    }
    setQuery(userQuery);
    setIsLoading(true);
    setError(null);
    setFinalResponse(null);
    setIntermediateSteps([]);
    setLoadingMessage('Initializing workflow...');

    try {
      const { finalResponse, intermediateSteps } = await runParallelWorkflow(userQuery, handleUpdateLoadingMessage);
      setFinalResponse(finalResponse);
      setIntermediateSteps(intermediateSteps);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleExampleQuery = () => {
    const example = "Analyze the key challenges and opportunities for electric vehicle adoption in emerging markets over the next decade.";
    handleSubmit(example);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <LogoIcon className="h-10 w-10 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Parallel Task Workflow Visualizer
            </h1>
          </div>
          <button
            onClick={handleExampleQuery}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-md transition-colors text-sm"
          >
            Run Example Query
          </button>
        </header>

        <main className="w-full">
          <QueryInput onSubmit={handleSubmit} isLoading={isLoading} />
          {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
          
          {isLoading && <Loader message={loadingMessage} />}
          
          {!isLoading && intermediateSteps.length > 0 && (
            <WorkflowVisualizer steps={intermediateSteps} finalResponse={finalResponse} />
          )}

          {!isLoading && !finalResponse && intermediateSteps.length === 0 && (
              <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg mt-8 border border-dashed border-gray-600">
                  <h2 className="text-xl font-semibold text-gray-300">Ready to start?</h2>
                  <p className="mt-2 text-gray-400">Enter a complex query above to see how AI agents collaborate to find a solution.</p>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

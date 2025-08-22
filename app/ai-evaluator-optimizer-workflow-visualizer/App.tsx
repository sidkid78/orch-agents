"use client";
import React, { useState, useCallback } from 'react';
import { AgentResponse as AgentResponseType } from './types';
import { executeWorkflow } from './services/geminiService';
import QueryInput from './components/QueryInput';
import WorkflowTimeline from './components/WorkflowTimeline';
import FinalResponse from './components/FinalResponse';
import { GithubIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [intermediateSteps, setIntermediateSteps] = useState<AgentResponseType[]>([]);
  const [finalResponse, setFinalResponse] = useState<string | null>(null);

  const handleStepUpdate = useCallback((step: AgentResponseType) => {
    setIntermediateSteps(prevSteps => [...prevSteps, step]);
  }, []);

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setIntermediateSteps([]);
    setFinalResponse(null);

    try {
      const result = await executeWorkflow(query, handleStepUpdate);
      setFinalResponse(result.finalResponse);
    } catch (err) {
      console.error("Workflow execution failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console and ensure your API key is configured correctly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              AI Evaluator-Optimizer Workflow
            </h1>
          </div>
          <a
            href="https://github.com/google/generative-ai-docs/blob/main/site/en/tutorials/node_quickstart.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-7 h-7" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <QueryInput
            query={query}
            setQuery={setQuery}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fade-in" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          {finalResponse && !isLoading && (
            <FinalResponse response={finalResponse} />
          )}
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 min-h-[50vh]">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Workflow Steps</h2>
          <WorkflowTimeline steps={intermediateSteps} isLoading={isLoading && intermediateSteps.length === 0} />
        </div>
      </main>
    </div>
  );
};

export default App;

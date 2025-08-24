
import React from 'react';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

const Header: React.FC = () => {
    return (
        <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <BrainCircuitIcon className="w-10 h-10 text-cyan-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Orchestrator-Workers AI Workflow</h1>
                        <p className="text-sm text-gray-400">Visualize complex task decomposition and synthesis by AI agents.</p>
                    </div>
                </div>
                <nav className="text-sm flex items-center gap-4">
                    <a href="/ai-evaluator-optimizer-workflow-visualizer" className="text-cyan-400 hover:text-cyan-300">Evaluator/Optimizer Demo →</a>
                    <label className="text-gray-400">
                        Gemini API Key:
                        <input
                            type="password"
                            placeholder="paste key"
                            className="ml-2 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                            onChange={(e) => localStorage.setItem('gemini_api_key', e.target.value)}
                        />
                    </label>
                </nav>
            </div>
        </header>
    );
};

export default Header;

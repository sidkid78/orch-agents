
import React from 'react';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

const Header: React.FC = () => {
    return (
        <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto flex items-center space-x-4">
                <BrainCircuitIcon className="w-10 h-10 text-cyan-400" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Orchestrator-Workers AI Workflow</h1>
                    <p className="text-sm text-gray-400">Visualize complex task decomposition and synthesis by AI agents.</p>
                </div>
            </div>
        </header>
    );
};

export default Header;

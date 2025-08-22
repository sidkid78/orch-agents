
import React from 'react';
import { TaskPlan, SubtaskResults, Subtask } from '../types';
import SubtaskCard from '../components/SubtaskCard';
import Spinner from '../components/Spinner';
import BrainCircuitIcon from '../components/icons/BrainCircuitIcon';
import GearsIcon from '../components/icons/GearsIcon';

interface OrchestratorViewProps {
    taskPlan: TaskPlan | null;
    subtaskResults: SubtaskResults;
    isLoading: boolean;
    isExecuting: boolean;
}

const OrchestratorView = ({ taskPlan, subtaskResults, isLoading, isExecuting }: OrchestratorViewProps) => {
    if (isLoading) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700 flex flex-col items-center text-center">
                <BrainCircuitIcon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-white">Orchestrator is Planning...</h3>
                <p className="text-gray-400 mt-2">Analyzing your query to create a detailed execution plan.</p>
                <Spinner className="w-8 h-8 mt-4 text-cyan-500" />
            </div>
        );
    }

    if (!taskPlan) {
        return null;
    }

    return (
        <>
            <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                    <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h3 className="text-xl font-bold text-white">2. Orchestrator&apos;s Plan</h3>
                        <p className="text-gray-400 text-sm">The task has been broken down into the following subtasks.</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <p><strong className="text-gray-300">Task Understanding:</strong> <span className="text-gray-400">{taskPlan.task_understanding}</span></p>
                    <p><strong className="text-gray-300">Execution Strategy:</strong> <span className="text-gray-400">{taskPlan.execution_strategy}</span></p>
                </div>
            </div>

            <div className="mt-8 bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                    <GearsIcon className="w-8 h-8 text-yellow-400" />
                    <div>
                        <h3 className="text-xl font-bold text-white">3. Worker Execution</h3>
                        <p className="text-gray-400 text-sm">Specialized agents are now executing the subtasks.</p>
                    </div>
                </div>
                {isExecuting && (
                    <div className="flex items-center text-yellow-400 text-sm mb-4">
                        <Spinner className="w-4 h-4 mr-2"/>
                        <span>Executing subtasks in parallel based on dependencies...</span>
                    </div>
                )}
                <div className="space-y-4">
                    {taskPlan.subtasks.map((subtask: Subtask) => (
                        <SubtaskCard 
                            key={subtask.id} 
                            subtask={subtask}
                            status={subtaskResults[subtask.id]?.status}
                            result={subtaskResults[subtask.id]?.result}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default OrchestratorView;

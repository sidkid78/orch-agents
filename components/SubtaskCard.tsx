
import React from 'react';
import { Subtask, SubtaskStatus } from '../types';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import CircleDotIcon from '../components/icons/CircleDotIcon';
import Spinner from '../components/Spinner';

interface SubtaskCardProps {
    subtask: Subtask;
    status: SubtaskStatus;
    result: string | null;
}

const StatusIcon: React.FC<{ status: SubtaskStatus }> = ({ status }) => {
    switch (status) {
        case SubtaskStatus.PENDING:
            return <CircleDotIcon className="w-5 h-5 text-gray-500" />;
        case SubtaskStatus.IN_PROGRESS:
            return <Spinner className="w-5 h-5 text-yellow-400" />;
        case SubtaskStatus.COMPLETED:
            return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
        case SubtaskStatus.FAILED:
            return <CheckCircleIcon className="w-5 h-5 text-red-400" />; // Replace with a fail icon if you have one
        default:
            return null;
    }
};

const SubtaskCard: React.FC<SubtaskCardProps> = ({ subtask, status, result }) => {
    const statusInfo = {
        [SubtaskStatus.PENDING]: { text: 'Pending', color: 'text-gray-400', bg: 'bg-gray-800/50', border: 'border-gray-700' },
        [SubtaskStatus.IN_PROGRESS]: { text: 'In Progress', color: 'text-yellow-300', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50' },
        [SubtaskStatus.COMPLETED]: { text: 'Completed', color: 'text-green-300', bg: 'bg-green-900/30', border: 'border-green-700/50' },
        [SubtaskStatus.FAILED]: { text: 'Failed', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50' },
    };

    const currentStatus = statusInfo[status];

    return (
        <div className={`p-4 rounded-lg border ${currentStatus.border} ${currentStatus.bg} transition-all duration-500`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-medium text-cyan-400">{subtask.required_expertise}</p>
                    <h4 className="font-bold text-white">{subtask.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-xs font-semibold ${currentStatus.color}`}>{currentStatus.text}</span>
                    <StatusIcon status={status} />
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{subtask.description}</p>
            
            {subtask.dependencies.length > 0 && (
                <div className="mt-3 text-xs">
                    <span className="font-semibold text-gray-300">Dependencies: </span>
                    <span className="text-gray-400">{subtask.dependencies.join(', ')}</span>
                </div>
            )}

            {status === SubtaskStatus.COMPLETED && result && (
                <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <p className="text-xs font-bold text-gray-300 mb-1">Result:</p>
                    <p className="text-sm text-gray-200 bg-black/20 p-2 rounded-md whitespace-pre-wrap">{result}</p>
                </div>
            )}
        </div>
    );
};

export default SubtaskCard;

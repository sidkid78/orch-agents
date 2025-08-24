
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Spinner from './Spinner';
import ClipboardCheckIcon from '../components/icons/ClipboardCheckIcon';

interface SynthesizerViewProps {
    finalResponse: string | null;
    isLoading: boolean;
}

const SynthesizerView: React.FC<SynthesizerViewProps> = ({ finalResponse, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700 flex flex-col items-center text-center">
                <ClipboardCheckIcon className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-white">Synthesizer is Working...</h3>
                <p className="text-gray-400 mt-2">Integrating all worker results into a final, cohesive response.</p>
                <Spinner className="w-8 h-8 mt-4 text-green-500" />
            </div>
        );
    }

    if (!finalResponse) {
        return null;
    }
    
    return (
        <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
                <ClipboardCheckIcon className="w-8 h-8 text-green-400" />
                <div>
                    <h3 className="text-xl font-bold text-white">4. Final Synthesized Response</h3>
                    <p className="text-gray-400 text-sm">The complete answer, integrated from all subtask results.</p>
                </div>
            </div>
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none bg-black/20 p-4 rounded-md">
                <ReactMarkdown>{finalResponse}</ReactMarkdown>
            </div>
        </div>
    );
};

export default SynthesizerView;

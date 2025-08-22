
import React from 'react';
import { AgentResponse } from '../types';
import TimelineCard from './TimelineCard';
import LoadingSpinner from './LoadingSpinner';

interface WorkflowTimelineProps {
  steps: AgentResponse[];
  isLoading: boolean;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ steps, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <LoadingSpinner className="w-10 h-10 mb-4" />
        <p className="text-lg animate-pulse">Initializing Workflow...</p>
        <p className="text-sm">The AI agents are preparing to process your request.</p>
      </div>
    );
  }
  
  if (steps.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full mb-4"></div>
            <p className="text-lg">Workflow timeline is empty</p>
            <p className="text-sm">Submit a query to see the AI agents in action.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <TimelineCard
          key={index}
          step={step}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
};

export default WorkflowTimeline;

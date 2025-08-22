
import React from 'react';
import { AgentResponse, EvaluationData } from '../types';
import { BrainCircuitIcon, EditIcon, LightbulbIcon, SearchCheckIcon } from './Icons';
import EvaluationCard from './EvaluationCard';

interface TimelineCardProps {
  step: AgentResponse;
  isLast: boolean;
}

const AGENT_CONFIG = {
  'Evaluation Criteria Designer': {
    icon: BrainCircuitIcon,
    color: 'purple',
  },
  'Content Creator': {
    icon: LightbulbIcon,
    color: 'blue',
  },
  'Quality Assessor': {
    icon: SearchCheckIcon,
    color: 'yellow',
  },
  'Refinement Specialist': {
    icon: EditIcon,
    color: 'green',
  },
};

const TimelineCard: React.FC<TimelineCardProps> = ({ step, isLast }) => {
  const config = AGENT_CONFIG[step.agent_role];
  const Icon = config.icon;

  const colorClasses = {
    bg: `bg-${config.color}-500/10`,
    border: `border-${config.color}-500/50`,
    text: `text-${config.color}-300`,
    iconBg: `bg-${config.color}-500/20`,
    ring: `ring-${config.color}-500/30`,
  };

  const isEvaluation = step.agent_role === 'Quality Assessor';

  return (
    <div className="relative flex items-start animate-slide-in-left">
      <div className="flex flex-col items-center mr-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colorClasses.iconBg} flex items-center justify-center ring-4 ${colorClasses.ring}`}>
          <Icon className={`w-6 h-6 ${colorClasses.text}`} />
        </div>
        {!isLast && <div className="w-px h-full bg-gray-600 mt-2"></div>}
      </div>
      <div className={`w-full p-4 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}>
        <h3 className={`font-semibold ${colorClasses.text}`}>{step.agent_role}</h3>
        {isEvaluation ? (
          <EvaluationCard metadata={step.metadata as unknown as EvaluationData} />
        ) : (
          <div className="mt-2 text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {step.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;


import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AgentResponse, Subtask } from '../types';
import { AgentCard } from './AgentCard';
import { DividerIcon, SpecialistIcon, IntegratorIcon, ArrowRightIcon, ArrowDownIcon } from './icons';

interface WorkflowVisualizerProps {
  steps: AgentResponse[];
  finalResponse: string | null;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ steps }) => {
  const dividerStep = steps.find(step => step.agent_role === 'Task Divider');
  const specialistSteps = steps.filter(step => step.agent_role.endsWith('Specialist'));
  const integratorStep = steps.find(step => step.agent_role === 'Results Integrator');

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-start">
        {/* Stage 1: Task Division */}
        <div className="lg:col-span-3 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">1. Task Division</h2>
            {dividerStep && dividerStep.metadata && (
                <AgentCard
                    agentRole={dividerStep.agent_role}
                    icon={<DividerIcon className="h-6 w-6 text-cyan-400" />}
                >
                    <p className="text-sm text-gray-400 mb-2 font-medium">Reasoning:</p>
                    <p className="text-sm text-gray-300 mb-4 italic">&quot;{dividerStep.metadata?.reasoning}&quot;</p>
                    <p className="text-sm text-gray-400 mb-2 font-medium">Generated Subtasks:</p>
                    <ul className="space-y-2">
                        {(dividerStep.metadata.subtasks || []).map((st: Subtask) => (
                            <li key={st.id} className="text-sm p-2 bg-gray-800/70 rounded-md">
                                <span className="font-semibold text-cyan-300">{st.title}: </span>
                                <span className="text-gray-300">{st.description}</span>
                            </li>
                        ))}
                    </ul>
                </AgentCard>
            )}
        </div>

        {/* Arrow Connector */}
        <div className="hidden lg:flex lg:col-span-1 h-full items-center justify-center pt-16">
            <ArrowRightIcon className="h-12 w-12 text-gray-600" />
        </div>
        <div className="flex lg:hidden col-span-1 h-full items-center justify-center">
            <ArrowDownIcon className="h-12 w-12 text-gray-600" />
        </div>

        {/* Stage 2: Parallel Processing */}
        <div className="lg:col-span-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-purple-400 mb-4">2. Parallel Processing</h2>
            <div className="w-full space-y-4">
                {specialistSteps.map((step, index) => (
                    <AgentCard
                        key={index}
                        agentRole={step.agent_role}
                        icon={<SpecialistIcon className="h-6 w-6 text-purple-400" />}
                    >
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{step.content}</ReactMarkdown>
                        </div>
                    </AgentCard>
                ))}
            </div>
        </div>

        {/* Arrow Connector */}
        <div className="hidden lg:flex lg:col-span-1 h-full items-center justify-center pt-16">
            <ArrowRightIcon className="h-12 w-12 text-gray-600" />
        </div>
         <div className="flex lg:hidden col-span-1 h-full items-center justify-center">
            <ArrowDownIcon className="h-12 w-12 text-gray-600" />
        </div>

        {/* Stage 3: Result Integration */}
        <div className="lg:col-span-2 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-green-400 mb-4">3. Result Integration</h2>
            {integratorStep && (
                <AgentCard
                    agentRole={integratorStep.agent_role}
                    icon={<IntegratorIcon className="h-6 w-6 text-green-400" />}
                >
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{integratorStep.content}</ReactMarkdown>
                    </div>
                </AgentCard>
            )}
        </div>
      </div>
    </div>
  );
};

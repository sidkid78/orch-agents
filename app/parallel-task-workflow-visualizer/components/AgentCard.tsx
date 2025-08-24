
import React from 'react';

interface AgentCardProps {
  agentRole: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agentRole, icon, children }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg p-4 transition-all hover:shadow-cyan-500/10 hover:border-gray-600">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-200">{agentRole}</h3>
      </div>
      <div className="prose prose-sm prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
};

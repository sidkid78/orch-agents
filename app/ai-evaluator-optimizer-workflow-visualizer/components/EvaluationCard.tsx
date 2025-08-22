import React from 'react';
import { EvaluationData } from '../types';
// Note: In this environment, we assume Recharts is globally available via script tag

interface EvaluationCardProps {
  metadata: EvaluationData;
}

  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: { value: number, payload: { feedback: string } }[], label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-600 rounded-md text-sm">
          <p className="label text-white">{`${label} : ${payload[0].value.toFixed(2)}`}</p>
          <p className="intro text-gray-400">{payload[0].payload.feedback}</p>
        </div>
      );
    }
  
    return null;
};

type RechartsComponent = React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>;
type RechartsModule = {
  Radar: RechartsComponent;
  RadarChart: RechartsComponent;
  PolarGrid: RechartsComponent;
  PolarAngleAxis: RechartsComponent;
  ResponsiveContainer: RechartsComponent;
  Tooltip: RechartsComponent;
};

const EvaluationCard: React.FC<EvaluationCardProps> = ({ metadata }) => {
  // Safely access Recharts from the window object, which is loaded via a script tag.
  const win = (typeof window !== 'undefined' ? (window as unknown as { Recharts?: RechartsModule }) : undefined);
  const Recharts = win?.Recharts;

  const chartData = metadata.criterion_scores.map(cs => ({
    criterion: cs.criterion,
    score: cs.score,
    feedback: cs.feedback,
    fullMark: 1.0,
  }));

  const overallScorePercentage = metadata.overall_score * 100;

  return (
    <div className="mt-2 text-sm text-gray-300">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
            <h4 className="font-semibold text-yellow-200 mb-2">Improvement Suggestions</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
                {metadata.improvement_suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
                ))}
            </ul>
             <div className="mt-4">
                <h4 className="font-semibold text-yellow-200 mb-2">Overall Score</h4>
                 <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-yellow-500 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
                        style={{ width: `${overallScorePercentage}%` }}
                    >
                       {metadata.overall_score.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full md:w-64 h-64 flex-shrink-0">
          {Recharts ? (
            (() => {
              // Destructure only if Recharts is available to prevent runtime errors.
              const { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } = Recharts as RechartsModule;
              return (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#4b5563" />
                    <PolarAngleAxis dataKey="criterion" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                    <Radar name="Score" dataKey="score" stroke="#facc15" fill="#facc15" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              );
            })()
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-xs">Loading chart...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationCard;


// Frontend client: call server API instead of using SDK directly.
import type { AgentResponse, CriteriaData } from '../types';
import { Type } from "@google/genai";
export const model = 'gemini-2.5-flash';

export const defineCriteriaSchema = {
    type: Type.OBJECT,
    properties: {
        task_type: { type: Type.STRING, description: "The type of task for the user query (e.g., 'Email Drafting', 'Code Generation', 'Creative Writing')." },
        criteria: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the criterion (e.g., 'Clarity')." },
                    description: { type: Type.STRING, description: "Description of what this criterion measures." },
                    weight: { type: Type.NUMBER, description: "Relative importance (0.0 to 1.0)." }
                },
                required: ["name", "description", "weight"]
            }
        },
        max_iterations: { type: Type.INTEGER, description: "Recommended number of optimization iterations (1 to 3)." },
        target_audience: { type: Type.STRING, description: "The target audience for the response." },
        special_considerations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["task_type", "criteria", "max_iterations", "target_audience"]
};

export const evaluateResponseSchema = {
    type: Type.OBJECT,
    properties: {
        overall_score: { type: Type.NUMBER, description: "Overall score of the response (0.0 to 1.0)." },
        criterion_scores: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    criterion: { type: Type.STRING, description: "Name of the criterion being scored." },
                    score: { type: Type.NUMBER, description: "Score for this criterion (0.0 to 1.0)." },
                    feedback: { type: Type.STRING, description: "Specific feedback for this criterion." }
                },
                required: ["criterion", "score", "feedback"]
            }
        },
        improvement_suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable suggestions for improvement."
        },
        is_satisfactory: { type: Type.BOOLEAN, description: "Whether the response is satisfactory and needs no more improvement." }
    },
    required: ["overall_score", "criterion_scores", "improvement_suggestions", "is_satisfactory"]
};

export const defaultCriteria: CriteriaData = {
    task_type: "General Query",
    criteria: [
        { name: "Clarity", description: "Is the response easy to understand?", weight: 0.4 },
        { name: "Accuracy", description: "Is the information factually correct?", weight: 0.3 },
        { name: "Completeness", description: "Does it fully answer the user's query?", weight: 0.3 }
    ],
    max_iterations: 2,
    target_audience: "General audience",
    special_considerations: []
};


export const executeWorkflow = async (
  userQuery: string,
  onStepUpdate: (step: AgentResponse) => void
): Promise<{ finalResponse: string; steps: AgentResponse[] }> => {
  const res = await fetch('/api/ai-evaluator-optimizer/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuery })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to execute evaluator-optimizer workflow');
  }
  // Streamed steps are out of scope; expect full payload
  const data = await res.json();
  const steps: AgentResponse[] = data.steps || [];
  steps.forEach(onStepUpdate);
  return { finalResponse: data.finalResponse as string, steps };
};

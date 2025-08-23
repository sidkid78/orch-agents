import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import type { AgentResponse, CriteriaData, EvaluationData } from '../../../ai-evaluator-optimizer-workflow-visualizer/types';

const getAi = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY environment variable not set');
  return new GoogleGenAI({ apiKey });
};

const model = 'gemini-2.5-flash';

const defineCriteriaSchema = {
  type: Type.OBJECT,
  properties: {
    task_type: { type: Type.STRING },
    criteria: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, weight: { type: Type.NUMBER } }, required: ['name','description','weight'] } },
    max_iterations: { type: Type.INTEGER },
    target_audience: { type: Type.STRING },
    special_considerations: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['task_type','criteria','max_iterations','target_audience']
};

const evaluateResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overall_score: { type: Type.NUMBER },
    criterion_scores: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { criterion: { type: Type.STRING }, score: { type: Type.NUMBER }, feedback: { type: Type.STRING } }, required: ['criterion','score','feedback'] } },
    improvement_suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    is_satisfactory: { type: Type.BOOLEAN }
  },
  required: ['overall_score','criterion_scores','improvement_suggestions','is_satisfactory']
};

const defaultCriteria: CriteriaData = {
  task_type: 'General Query',
  criteria: [
    { name: 'Clarity', description: 'Is the response easy to understand?', weight: 0.4 },
    { name: 'Accuracy', description: 'Is the information factually correct?', weight: 0.3 },
    { name: 'Completeness', description: 'Does it fully answer the user\'s query?', weight: 0.3 }
  ],
  max_iterations: 2,
  target_audience: 'General audience',
  special_considerations: []
};

export async function POST(req: NextRequest) {
  try {
    const { userQuery } = await req.json();
    if (typeof userQuery !== 'string' || !userQuery.trim()) {
      return new NextResponse('Invalid userQuery', { status: 400 });
    }

    const ai = getAi();
    const steps: AgentResponse[] = [];
    let criteriaData: CriteriaData;

    try {
      const criteriaPrompt = `Analyze the following user query and define evaluation criteria for a high-quality response. Consider the task type, audience, and key metrics for success.\n\nUSER QUERY: "${userQuery}"`;
      const criteriaResult = await ai.models.generateContent({
        model,
        contents: criteriaPrompt,
        config: { responseMimeType: 'application/json', responseSchema: defineCriteriaSchema }
      });
      const jsonText = (criteriaResult.text ?? '').trim();
      criteriaData = JSON.parse(jsonText);
    } catch {
      criteriaData = defaultCriteria;
    }

    steps.push({
      agent_role: 'Evaluation Criteria Designer',
      content: `Task Type: ${criteriaData.task_type}\nTarget Audience: ${criteriaData.target_audience}\nMax Iterations: ${criteriaData.max_iterations}\n\nCriteria:\n${criteriaData.criteria.map(c => `- ${c.name} (Weight: ${c.weight}): ${c.description}`).join('\n')}`,
      metadata: criteriaData as unknown as Record<string, string>
    });

    const generatorPrompt = `You are the "Content Creator"...\n\nUSER QUERY: "${userQuery}"\nTASK TYPE: ${criteriaData.task_type}\nTARGET AUDIENCE: ${criteriaData.target_audience}\n\nEVALUATION CRITERIA TO FOCUS ON:\n${criteriaData.criteria.map(c => `- ${c.name}: ${c.description}`).join('\n')}\n\nPlease provide your initial response now.`;
    const initialResult = await ai.models.generateContent({ model, contents: generatorPrompt });
    let currentResponse: string = initialResult.text ?? '';
    steps.push({ agent_role: 'Content Creator', content: currentResponse, metadata: { iteration: '1', stage: 'initial_generation' } });

    const maxIterations = Math.min(criteriaData.max_iterations, 2);
    for (let i = 1; i <= maxIterations; i++) {
      const evaluatorPrompt = `You are the "Quality Assessor"...\n\nORIGINAL USER QUERY: "${userQuery}"\n\nEVALUATION CRITERIA:\n${criteriaData.criteria.map(c => `- ${c.name} (Weight: ${c.weight}): ${c.description}`).join('\n')}\n\nCURRENT RESPONSE (to be evaluated):\n---\n${currentResponse}\n---\n\nPlease provide your structured evaluation now.`;
      let evaluation: EvaluationData;
      try {
        const evaluationResult = await ai.models.generateContent({ model, contents: evaluatorPrompt, config: { responseMimeType: 'application/json', responseSchema: evaluateResponseSchema } });
        evaluation = JSON.parse((evaluationResult.text ?? '').trim());
      } catch {
        break;
      }
      steps.push({ agent_role: 'Quality Assessor', content: `Overall Score: ${evaluation.overall_score.toFixed(2)}\n\nSuggestions:\n${evaluation.improvement_suggestions.map(s => `- ${s}`).join('\n')}`, metadata: { iteration: i.toString(), stage: 'evaluation', ...evaluation } as unknown as Record<string, string> });
      if (evaluation.is_satisfactory && i < maxIterations) break;

      const optimizerPrompt = `You are the "Refinement Specialist"...\n\nORIGINAL USER QUERY: "${userQuery}"\n\nCURRENT RESPONSE:\n---\n${currentResponse}\n---\n\nEVALUATION FEEDBACK:\nOverall Score: ${evaluation.overall_score.toFixed(2)}\nCriterion Feedback:\n${evaluation.criterion_scores.map(s => `- ${s.criterion} (Score: ${s.score.toFixed(2)}): ${s.feedback}`).join('\n')}\nImprovement Suggestions:\n${evaluation.improvement_suggestions.map(s => `- ${s}`).join('\n')}\n\nPlease provide the new, optimized response now.`;
      const optimizationResult = await ai.models.generateContent({ model, contents: optimizerPrompt });
      currentResponse = optimizationResult.text ?? currentResponse;
      steps.push({ agent_role: 'Refinement Specialist', content: currentResponse, metadata: { iteration: (i + 1).toString(), stage: 'optimization' } as unknown as Record<string, string>    });
    }

    return NextResponse.json({ finalResponse: currentResponse, steps });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Failed to execute evaluator-optimizer workflow';
    return new NextResponse(message, { status: 500 });
  }
}



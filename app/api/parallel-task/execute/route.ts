import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import type { AgentResponse, Subtask, TaskBreakdown, WorkerResult } from '../../../parallel-task-workflow-visualizer/types';

const getAi = (apiKeyOverride?: string) => {
  const apiKey = apiKeyOverride || process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY environment variable not set');
  return new GoogleGenAI({ apiKey });
};

const model = 'gemini-2.5-flash';

const taskBreakdownSchema = {
  type: Type.OBJECT,
  properties: {
    subtasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          perspective: { type: Type.STRING }
        },
        required: ['id','title','description','perspective']
      }
    },
    reasoning: { type: Type.STRING }
  },
  required: ['subtasks','reasoning']
};

export async function POST(req: NextRequest) {
  try {
    const { userQuery } = await req.json();
    const apiKey = req.headers.get('x-gemini-key') || undefined;
    if (typeof userQuery !== 'string' || !userQuery.trim()) {
      return new NextResponse('Invalid userQuery', { status: 400 });
    }
    const ai = getAi(apiKey);

    const sectioningPrompt = `ROLE: Task Sectioning Agent\nTASK: Break down the user's complex query into 3-5 independent subtasks. USER QUERY: "${userQuery}"`;
    let taskBreakdown: TaskBreakdown;
    try {
      const breakdownResponse = await ai.models.generateContent({ model, contents: sectioningPrompt, config: { responseMimeType: 'application/json', responseSchema: taskBreakdownSchema } });
      taskBreakdown = JSON.parse((breakdownResponse.text ?? '').trim());
    } catch {
      taskBreakdown = { subtasks: [{ id: 'subtask_1', title: 'General Analysis', description: `Provide a general analysis of: ${userQuery}`, perspective: 'Holistic' }], reasoning: 'Fallback' };
    }

    const steps: AgentResponse[] = [];
    steps.push({ agent_role: 'Task Divider', content: `Task Breakdown:\n${taskBreakdown.reasoning}`, metadata: { reasoning: taskBreakdown.reasoning, subtasks: taskBreakdown.subtasks } });

    const processSubtask = async (subtask: Subtask): Promise<WorkerResult> => {
      const workerPrompt = `ORIGINAL USER QUERY: "${userQuery}"\nYOUR ASSIGNED SUBTASK:\n- Title: ${subtask.title}\n- Description: ${subtask.description}\n- Perspective: You are a ${subtask.perspective} Specialist.`;
      const workerResponse = await ai.models.generateContent({ model, contents: workerPrompt, config: { temperature: 0.7 } });
      return { subtask_id: subtask.id, title: subtask.title, perspective: subtask.perspective, response: workerResponse.text ?? '' };
    };

    const subtaskResults = await Promise.all(taskBreakdown.subtasks.map(processSubtask));
    subtaskResults.forEach(result => {
      steps.push({ agent_role: `${result.perspective} Specialist`, content: result.response, metadata: { subtask_id: result.subtask_id, title: result.title, perspective: result.perspective } });
    });

    const formattedResults = subtaskResults.map((r, i) => `--- SUBTASK ${i+1}: ${r.title} (from ${r.perspective} perspective) ---\n${r.response}\n`).join('\n');
    const aggregatorPrompt = `ROLE: Aggregator Agent\nTASK: Synthesize the following analyses into a single response.\nORIGINAL USER QUERY: "${userQuery}"\nSPECIALIST ANALYSES:\n${formattedResults}`;
    const finalGenResponse = await ai.models.generateContent({ model, contents: aggregatorPrompt, config: { temperature: 0.8 } });
    const finalResponse = finalGenResponse.text ?? '';
    steps.push({ agent_role: 'Results Integrator', content: finalResponse, metadata: { subtask_count: subtaskResults.length } });

    return NextResponse.json({ finalResponse, intermediateSteps: steps });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Failed to execute parallel workflow';
    return new NextResponse(message, { status: 500 });
  }
}



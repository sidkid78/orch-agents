import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { executeSubtask } from '../../../services/geminiService';
import type { Subtask } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userQuery, taskUnderstanding, subtask, dependencyResults } = body as {
      userQuery: string;
      taskUnderstanding: string;
      subtask: Subtask;
      dependencyResults: Record<string, string>;
    };
    if (!userQuery || !taskUnderstanding || !subtask) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    const result = await executeSubtask(userQuery, taskUnderstanding, subtask, dependencyResults || {});
    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Failed to execute subtask';
    return new NextResponse(message, { status: 500 });
  }
}



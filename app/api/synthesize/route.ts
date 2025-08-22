import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { synthesizeResults } from '../../../services/geminiService';
import type { TaskPlan } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userQuery, taskPlan, subtaskResults } = body as {
      userQuery: string;
      taskPlan: TaskPlan;
      subtaskResults: Record<string, string>;
    };
    if (!userQuery || !taskPlan || !subtaskResults) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    const result = await synthesizeResults(userQuery, taskPlan, subtaskResults);
    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = (err as Error).message || 'Failed to synthesize results';
    return new NextResponse(message, { status: 500 });
  }
}



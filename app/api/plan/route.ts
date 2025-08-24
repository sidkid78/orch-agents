import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateTaskPlan } from '../../../services/geminiService';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const apiKey = req.headers.get('x-gemini-key') || undefined;
    if (typeof query !== 'string' || !query.trim()) {
      return new NextResponse('Invalid query', { status: 400 });
    }
    const plan = await generateTaskPlan(query.trim(), apiKey);
    return NextResponse.json(plan);
  } catch (err: unknown) {
    const message = (err as Error).message || 'Failed to generate task plan';
    return new NextResponse(message, { status: 500 });
  }
}



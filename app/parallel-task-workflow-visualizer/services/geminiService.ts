
// Client calls server API; do not call SDK directly from browser.
import type { AgentResponse } from '../types';

export async function runParallelWorkflow(userQuery: string, updateLoadingMessage: (message: string) => void): Promise<{ finalResponse: string; intermediateSteps: AgentResponse[] }> {
  updateLoadingMessage('Starting...');
  const res = await fetch('/api/parallel-task/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },
    body: JSON.stringify({ userQuery })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to execute parallel workflow');
  }
  const data = await res.json();
  updateLoadingMessage('');
  return { finalResponse: data.finalResponse as string, intermediateSteps: data.intermediateSteps as AgentResponse[] };
}

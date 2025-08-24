
export interface Subtask {
  id: string;
  title: string;
  description: string;
  perspective: string;
}

export interface TaskBreakdown {
  subtasks: Subtask[];
  reasoning: string;
}

export interface AgentResponse {
  agent_role: string;
  content: string;
  metadata?: {
    reasoning?: string;
    subtasks?: Subtask[];
    subtask_id?: string;
    title?: string;
    perspective?: string;
    [key: string]: unknown;
  };
}

export interface WorkerResult {
  subtask_id: string;
  title: string;
  perspective: string;
  response: string;
}

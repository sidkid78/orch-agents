
export interface Subtask {
    id: string;
    title: string;
    description: string;
    required_expertise: string;
    priority: number;
    dependencies: string[];
  }
  
  export interface TaskPlan {
    task_understanding: string;
    subtasks: Subtask[];
    execution_strategy: string;
  }
  
  export enum SubtaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
  }
  
  export interface SubtaskResult {
    status: SubtaskStatus;
    result: string | null;
  }
  
  export type SubtaskResults = Record<string, SubtaskResult>;
  
  export interface AgentResponse {
    agentRole: string;
    content: string;
    metadata: Record<string, unknown>;
  }
  
  export interface LoadingStates {
    planning: boolean;
    executing: boolean;
    synthesizing: boolean;
  }
  
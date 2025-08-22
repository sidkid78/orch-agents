
export interface Criterion {
  name: string;
  description: string;
  weight: number;
}

export interface CriteriaData {
  task_type: string;
  criteria: Criterion[];
  max_iterations: number;
  target_audience: string;
  special_considerations?: string[];
}

export interface CriterionScore {
  criterion: string;
  score: number;
  feedback: string;
}

export interface EvaluationData {
  overall_score: number;
  criterion_scores: CriterionScore[];
  improvement_suggestions: string[];
  is_satisfactory: boolean;
}

export interface AgentResponse {
  agent_role: 'Evaluation Criteria Designer' | 'Content Creator' | 'Quality Assessor' | 'Refinement Specialist';
  content: string;
  metadata: Record<string, string>;
}

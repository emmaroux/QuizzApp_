export interface Question {
  id: string | number;
  statement: string;
  answer: boolean;
  explanation: string;
  detailed_explanation?: string;
  category?: string;
  discipline_id: string;
  difficulty?: number;
  created_at?: string;
}

export interface Score {
  correct: number;
  total: number;
}

export interface Game {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  created_at: string;
  completed_at?: string | null;
}

export interface PlayerStats {
  id: string;
  email: string;
  total_questions: number;
  correct_answers: number;
  ratio: number;
  contribution_score: number;
}

export interface Discipline {
  id: string;
  name: string;
  description: string;
}
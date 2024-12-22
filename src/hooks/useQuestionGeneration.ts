import { useState } from 'react';
import { generateQuestion } from '../lib/openai';
import { addAIGeneratedQuestion } from '../lib/supabase';
import type { Question } from '../types';

export function useQuestionGeneration() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateNewQuestion(): Promise<Question | null> {
    setGenerating(true);
    setError(null);

    try {
      const question = await generateQuestion();
      await addAIGeneratedQuestion(
        question.statement,
        question.answer,
        question.explanation,
        question.category
      );
      return question;
    } catch (err) {
      console.error('Error generating question:', err);
      setError('Failed to generate new question');
      return null;
    } finally {
      setGenerating(false);
    }
  }

  return {
    generateNewQuestion,
    generating,
    error
  };
}
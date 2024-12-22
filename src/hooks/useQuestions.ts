import { useState, useEffect } from 'react';
import { fetchQuestions } from '../lib/supabase';
import type { Question } from '../types';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  return { questions, loading, error };
}
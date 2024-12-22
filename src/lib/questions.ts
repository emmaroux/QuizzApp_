import { supabase } from './supabaseClient';
import { ensureAuthenticated } from './auth';
import type { Question } from '../types';

export async function fetchQuestions(): Promise<Question[]> {
  try {
    await ensureAuthenticated();
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to fetch questions:', err);
    return [];
  }
}

export async function addQuestion(
  statement: string,
  answer: boolean,
  explanation: string,
  category?: string,
  ai_generated: boolean = false
): Promise<void> {
  try {
    await ensureAuthenticated();
    
    const { error } = await supabase
      .from('questions')
      .insert([{
        statement,
        answer,
        explanation,
        category,
        ai_generated
      }]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to add question:', err);
    throw err;
  }
}
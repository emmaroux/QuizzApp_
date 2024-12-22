import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function fetchQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data;
}

export async function addQuestion(
  statement: string,
  answer: boolean,
  explanation: string,
  category?: string,
  ai_generated: boolean = false
) {
  const { error } = await supabase
    .from('questions')
    .insert([
      {
        statement,
        explanation,
        answer,
        category,
        ai_generated
      }
    ]);

  if (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

export async function importQuestionsFromCSV(csvContent: string) {
  const lines = csvContent.split('\n');
  const questions = lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
        ?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
      
      if (values.length < 3) return null;

      return {
        answer: values[0].toLowerCase() === 'oui',
        statement: values[1],
        explanation: values[2].replace(/\[.*?\]/g, '').trim()
      };
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);

  let imported = 0;
  let errors = 0;

  for (const question of questions) {
    try {
      await addQuestion(
        question.statement,
        question.answer,
        question.explanation,
        undefined,
        false
      );
      imported++;
    } catch (err) {
      console.error('Error importing question:', err);
      errors++;
    }
  }

  return { imported, errors };
}
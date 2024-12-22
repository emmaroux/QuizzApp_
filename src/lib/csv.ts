import { supabase } from './supabaseClient';

interface QuestionData {
  statement: string;
  answer: boolean;
  explanation: string;
  detailed_explanation?: string;
  category?: string;
  difficulty?: number;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { // Double quotes inside quotes
        currentValue += '"';
        i++;
      } else { // Start/end of quoted section
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) { // End of field
      result.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last field
  result.push(currentValue.trim());
  return result;
}

function cleanText(text: string): string {
  return text
    .replace(/^["']|["']$/g, '') // Remove surrounding quotes
    .replace(/\\n/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/""/g, '"') // Replace double quotes with single quotes
    .trim();
}

export async function importQuestionsFromCSV(csvContent: string) {
  // D'abord, récupérer l'ID de la discipline Physique
  const { data: disciplines, error: disciplineError } = await supabase
    .from('disciplines')
    .select('id')
    .eq('name', 'Physique')
    .single();

  if (disciplineError || !disciplines) {
    console.error('Error getting Physics discipline:', disciplineError);
    return { imported: 0, errors: 1, duplicates: 0 };
  }

  const physicsId = disciplines.id;

  const lines = csvContent.split('\n');
  const questions: QuestionData[] = [];
  let imported = 0;
  let errors = 0;
  let duplicates = 0;

  // Parse CSV content
  for (const line of lines.slice(1)) { // Skip header
    if (!line.trim()) continue;

    try {
      const values = parseCSVLine(line);
      if (values.length < 6) {
        errors++;
        continue;
      }

      const question: QuestionData = {
        statement: cleanText(values[0]),
        answer: cleanText(values[1]).toLowerCase() === 'true',
        explanation: cleanText(values[2]),
        detailed_explanation: cleanText(values[3]),
        category: cleanText(values[4]),
        difficulty: parseInt(cleanText(values[5]), 10)
      };

      // Skip empty questions
      if (!question.statement || !question.explanation) {
        errors++;
        continue;
      }

      questions.push(question);
    } catch (err) {
      console.error('Error parsing line:', line, err);
      errors++;
    }
  }

  // Vider la table des questions existantes
  try {
    await supabase.rpc('clear_all_data');
  } catch (err) {
    console.error('Error clearing database:', err);
    return { imported: 0, errors: 1, duplicates: 0 };
  }

  // Insérer les nouvelles questions
  for (const question of questions) {
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          statement: question.statement,
          answer: question.answer,
          explanation: question.explanation,
          detailed_explanation: question.detailed_explanation || null,
          category: question.category || null,
          difficulty: question.difficulty || null,
          discipline_id: physicsId // Ajouter l'ID de la discipline Physique
        }]);

      if (error) {
        console.error('Error inserting question:', error);
        errors++;
      } else {
        imported++;
      }
    } catch (err) {
      console.error('Error processing question:', err);
      errors++;
    }
  }

  return { imported, errors, duplicates };
}
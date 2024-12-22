import OpenAI from 'openai';
import type { Question } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Generate true/false questions about general knowledge. 
Each question should:
- Be factual and verifiable
- Include a clear explanation
- Be suitable for educational purposes
- Be engaging and thought-provoking

Return the response in this JSON format:
{
  "statement": "The question statement",
  "answer": true/false,
  "explanation": "Detailed explanation of why the answer is correct",
  "category": "Category of the question (e.g., Science, History, etc.)"
}`;

export async function generateQuestion(): Promise<Question> {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "Generate a new true/false question" }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" }
  });

  const response = JSON.parse(completion.choices[0].message.content!);
  
  return {
    id: crypto.randomUUID(),
    statement: response.statement,
    answer: response.answer,
    explanation: response.explanation,
    category: response.category,
    ai_generated: true,
    created_at: new Date().toISOString()
  };
}
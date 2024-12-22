/*
  # Quiz Questions Schema

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `statement` (text) - The question text
      - `answer` (boolean) - True/False answer
      - `explanation` (text) - Explanation of the answer
      - `created_at` (timestamp) - When the question was created
      - `ai_generated` (boolean) - Whether the question was AI-generated
      - `category` (text) - Optional category/topic of the question

  2. Security
    - Enable RLS on questions table
    - Add policy for public read access
    - Add policy for authenticated users to insert AI-generated questions
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statement text NOT NULL,
  answer boolean NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now(),
  ai_generated boolean DEFAULT false,
  category text,
  CONSTRAINT valid_statement CHECK (char_length(statement) > 0),
  CONSTRAINT valid_explanation CHECK (char_length(explanation) > 0)
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to questions
CREATE POLICY "Questions are viewable by everyone" 
  ON questions
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert AI-generated questions
CREATE POLICY "Authenticated users can insert AI-generated questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (ai_generated = true);
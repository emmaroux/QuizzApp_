/*
  # Update questions table and policies

  1. Changes
    - Ensures table and policies are created only if they don't exist
    - Uses DO blocks for safe policy creation
  
  2. Security
    - Maintains RLS on questions table
    - Preserves public read access
    - Preserves authenticated users' ability to insert AI-generated questions
*/

-- Create table if it doesn't exist
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

-- Safely create policies using DO blocks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' 
    AND policyname = 'Questions are viewable by everyone'
  ) THEN
    CREATE POLICY "Questions are viewable by everyone" 
      ON questions
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' 
    AND policyname = 'Authenticated users can insert AI-generated questions'
  ) THEN
    CREATE POLICY "Authenticated users can insert AI-generated questions"
      ON questions
      FOR INSERT
      TO authenticated
      WITH CHECK (ai_generated = true);
  END IF;
END $$;
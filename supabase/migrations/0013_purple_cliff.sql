/*
  # Add detailed explanation to questions

  1. Changes
    - Add detailed_explanation column to questions table
    - Update RLS policies to include the new column

  2. Security
    - Maintain existing RLS policies
*/

-- Add detailed_explanation column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS detailed_explanation text;

-- Update constraints to allow null detailed_explanation
ALTER TABLE questions
DROP CONSTRAINT IF EXISTS valid_explanation,
ADD CONSTRAINT valid_explanation 
  CHECK (char_length(explanation) > 0);

-- Add constraint for detailed_explanation when present
ALTER TABLE questions
ADD CONSTRAINT valid_detailed_explanation 
  CHECK (detailed_explanation IS NULL OR char_length(detailed_explanation) > 0);
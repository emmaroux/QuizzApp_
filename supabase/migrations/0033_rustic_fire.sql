/*
  # Update questions schema

  1. Changes
    - Add subcategory column
    - Add difficulty column (integer 1-5)
    - Update constraints and validations

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS subcategory text,
ADD COLUMN IF NOT EXISTS difficulty integer;

-- Add constraint for difficulty range
ALTER TABLE questions
ADD CONSTRAINT valid_difficulty 
  CHECK (difficulty >= 1 AND difficulty <= 5);

-- Update existing policies to include new columns
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
CREATE POLICY "Admins can manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Clear existing questions
TRUNCATE questions CASCADE;
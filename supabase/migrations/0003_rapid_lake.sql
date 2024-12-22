/*
  # Update RLS policies for questions table

  1. Changes
    - Add new policy to allow insertion of manual questions
    - Keep existing policies for AI-generated questions and public viewing

  2. Security
    - Maintain public read access
    - Allow both manual and AI-generated question insertions
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can insert AI-generated questions" ON questions;

-- Create new comprehensive insert policy
CREATE POLICY "Users can insert questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Note: The select policy remains unchanged as it already allows public access
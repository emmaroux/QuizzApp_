/*
  # Fix disciplines RLS policies

  1. Changes
    - Add policy to allow initial disciplines creation
    - Split admin management into separate policies for update and delete
    - Keep existing policies for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view disciplines" ON disciplines;
DROP POLICY IF EXISTS "Admins can manage disciplines" ON disciplines;

-- Create new policies
CREATE POLICY "Anyone can view disciplines"
  ON disciplines FOR SELECT
  USING (true);

CREATE POLICY "Allow initial disciplines creation"
  ON disciplines FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update disciplines"
  ON disciplines FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete disciplines"
  ON disciplines FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );
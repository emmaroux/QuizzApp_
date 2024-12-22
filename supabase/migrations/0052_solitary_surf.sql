/*
  # Fix disciplines policies

  1. Changes
    - Remove USING clause from INSERT policy
    - Keep only WITH CHECK for INSERT policy
    - Maintain other policies as is
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view disciplines" ON disciplines;
DROP POLICY IF EXISTS "Authenticated users can insert disciplines" ON disciplines;
DROP POLICY IF EXISTS "Admins can update disciplines" ON disciplines;
DROP POLICY IF EXISTS "Admins can delete disciplines" ON disciplines;

-- Create new comprehensive policies
CREATE POLICY "Anyone can view disciplines"
  ON disciplines FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert disciplines"
  ON disciplines FOR INSERT
  TO authenticated
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

-- Refresh materialized views
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
/*
  # Fix disciplines table policies

  1. Changes
    - Drop all existing policies
    - Create a simpler set of policies
    - Allow admins full control
    - Allow public read access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view disciplines" ON disciplines;
DROP POLICY IF EXISTS "Authenticated users can insert disciplines" ON disciplines;
DROP POLICY IF EXISTS "Admins can update disciplines" ON disciplines;
DROP POLICY IF EXISTS "Admins can delete disciplines" ON disciplines;

-- Create new simplified policies
CREATE POLICY "Public read access"
  ON disciplines FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access"
  ON disciplines FOR ALL
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

-- Ensure the Physics discipline exists
DO $$
BEGIN
  INSERT INTO disciplines (name, description)
  VALUES (
    'Physique',
    'Questions de physique générale, mécanique, électromagnétisme, etc.'
  )
  ON CONFLICT (name) DO NOTHING;
END
$$;

-- Refresh materialized views
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
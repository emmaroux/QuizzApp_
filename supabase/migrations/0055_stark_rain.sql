-- First drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can read disciplines" ON disciplines;
DROP POLICY IF EXISTS "Admins can manage disciplines" ON disciplines;

-- Create a simple read-only policy for everyone
CREATE POLICY "Enable read access for all users"
  ON disciplines
  FOR SELECT
  TO public
  USING (true);

-- Create a separate policy for admin management
CREATE POLICY "Enable admin management"
  ON disciplines
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Insert Physics discipline if it doesn't exist using a more permissive approach
INSERT INTO disciplines (name, description)
VALUES (
  'Physique',
  'Questions de physique générale, mécanique, électromagnétisme, etc.'
)
ON CONFLICT (name) DO NOTHING;

-- Refresh materialized views
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
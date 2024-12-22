-- Drop all existing policies
DROP POLICY IF EXISTS "Public read access" ON disciplines;
DROP POLICY IF EXISTS "Admin full access" ON disciplines;

-- Create a policy for public read access
CREATE POLICY "Anyone can read disciplines"
  ON disciplines FOR SELECT
  USING (true);

-- Create a policy for admin management
CREATE POLICY "Admins can manage disciplines"
  ON disciplines
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

-- Ensure the Physics discipline exists by using a more secure approach
DO $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if we're running as an admin
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  ) INTO admin_exists;

  -- Only insert if we're running as admin or if the table is empty
  IF admin_exists OR NOT EXISTS (SELECT 1 FROM disciplines) THEN
    INSERT INTO disciplines (name, description)
    VALUES (
      'Physique',
      'Questions de physique générale, mécanique, électromagnétisme, etc.'
    )
    ON CONFLICT (name) DO NOTHING;
  END IF;
END
$$;

-- Refresh materialized views
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
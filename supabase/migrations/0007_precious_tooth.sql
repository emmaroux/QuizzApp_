/*
  # Fix user roles policies to prevent infinite recursion

  1. Changes
    - Simplify user roles policies
    - Fix admin check to prevent recursion
  
  2. Security
    - All authenticated users can view roles
    - Only admins can manage roles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON user_roles;

-- Create new, simplified policies
CREATE POLICY "Anyone can view roles"
  ON user_roles FOR SELECT
  USING (true);

-- Split admin policies by operation
CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );
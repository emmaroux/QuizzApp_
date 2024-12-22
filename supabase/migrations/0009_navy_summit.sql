/*
  # Fix user roles policies

  1. Changes
    - Remove recursive policies
    - Simplify role checking
    - Fix infinite recursion issue
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON user_roles;

-- Create new simplified policies
CREATE POLICY "Anyone can view user roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage user roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.name = 'admin'
      AND EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_id = r.id
      )
    )
  );
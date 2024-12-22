/*
  # Remove anonymous authentication and update policies

  1. Changes
    - Remove anonymous user
    - Update RLS policies to work with regular authentication
  
  2. Security
    - Questions are publicly readable
    - Only authenticated users can insert questions
    - Only admins can manage user roles
*/

-- Drop anonymous user if exists
DELETE FROM auth.users WHERE email = 'anonymous@example.com';

-- Update questions policies
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
DROP POLICY IF EXISTS "Authenticated users can insert AI-generated questions" ON questions;

-- Create new policies
CREATE POLICY "Questions are viewable by everyone"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update user_roles policies to be more secure
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON user_roles;

CREATE POLICY "Users can view roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage user roles"
  ON user_roles 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );
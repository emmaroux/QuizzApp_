/*
  # Fix admin users materialized view

  1. Changes
    - Drop existing policies that depend on admin_users view
    - Recreate admin_users view with unique index
    - Recreate policies using the new view
*/

-- Supprimer les politiques dépendantes
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;

-- Supprimer l'ancien index et la vue
DROP INDEX IF EXISTS idx_admin_users;
DROP MATERIALIZED VIEW IF EXISTS admin_users CASCADE;

-- Recréer la vue matérialisée avec un index unique
CREATE MATERIALIZED VIEW admin_users AS
SELECT DISTINCT u.id
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'admin';

-- Créer un index unique
CREATE UNIQUE INDEX admin_users_unique_id ON admin_users(id);

-- Rafraîchir la vue
REFRESH MATERIALIZED VIEW admin_users;

-- Recréer les politiques
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
  );

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
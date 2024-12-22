/*
  # Correction des politiques de sécurité pour user_roles

  1. Modifications
    - Simplification des politiques pour éviter la récursion
    - Séparation claire des permissions de lecture et d'écriture
    - Utilisation de politiques basées sur les rôles stockés en base
  
  2. Sécurité
    - Lecture : Tous les utilisateurs authentifiés peuvent voir les rôles
    - Écriture : Seuls les administrateurs peuvent modifier les rôles
*/

-- Supprimer les anciennes politiques qui causent la récursion
DROP POLICY IF EXISTS "Anyone can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;

-- Politique de lecture simple pour tous les utilisateurs authentifiés
CREATE POLICY "Authenticated users can view roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

-- Politique d'insertion pour les administrateurs
CREATE POLICY "Admins can insert user roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.name = 'admin'
      AND EXISTS (
        SELECT 1 FROM user_roles ur2
        WHERE ur2.user_id = auth.uid()
        AND ur2.role_id = r.id
      )
    )
  );

-- Politique de mise à jour pour les administrateurs
CREATE POLICY "Admins can update user roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.name = 'admin'
      AND EXISTS (
        SELECT 1 FROM user_roles ur2
        WHERE ur2.user_id = auth.uid()
        AND ur2.role_id = r.id
      )
    )
  );

-- Politique de suppression pour les administrateurs
CREATE POLICY "Admins can delete user roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.name = 'admin'
      AND EXISTS (
        SELECT 1 FROM user_roles ur2
        WHERE ur2.user_id = auth.uid()
        AND ur2.role_id = r.id
      )
    )
  );
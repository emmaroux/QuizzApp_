/*
  # Correction des politiques de sécurité
  
  1. Modifications
    - Simplifie les politiques pour éviter la récursion
    - Optimise les requêtes de vérification des rôles
    - Sépare clairement les permissions admin et utilisateur
*/

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Authenticated users can view roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON user_roles;

-- Créer une vue matérialisée pour les administrateurs
CREATE MATERIALIZED VIEW IF NOT EXISTS admin_users AS
SELECT DISTINCT u.id
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'admin';

-- Créer un index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_admin_users ON admin_users(id);

-- Nouvelle politique de lecture simplifiée
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Nouvelle politique d'écriture pour les admins
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

-- Fonction pour rafraîchir la vue des admins
CREATE OR REPLACE FUNCTION refresh_admin_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users;
  RETURN NULL;
END;
$$;

-- Trigger pour mettre à jour la vue des admins
CREATE TRIGGER refresh_admin_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_admin_users();
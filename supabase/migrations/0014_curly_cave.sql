/*
  # Ajout du rôle joueur et mise à jour des politiques

  1. Nouveaux rôles
    - Ajout du rôle 'player'
  
  2. Modifications des politiques
    - Les questions ne sont visibles que par les utilisateurs authentifiés
    - Seuls les administrateurs peuvent gérer les questions (import/suppression)
    - Les joueurs peuvent uniquement voir les questions
*/

-- Ajouter le rôle 'player'
INSERT INTO roles (name)
VALUES ('player')
ON CONFLICT (name) DO NOTHING;

-- Mettre à jour les politiques de la table questions
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
CREATE POLICY "Questions are viewable by authenticated users"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les administrateurs peuvent gérer les questions
DROP POLICY IF EXISTS "Users can insert questions" ON questions;
CREATE POLICY "Admins can manage questions"
  ON questions
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Assigner automatiquement le rôle 'player' aux nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_roles (user_id, role_id)
  SELECT NEW.id, r.id
  FROM roles r
  WHERE r.name = 'player';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour les nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
/*
  # Correction de l'inscription des utilisateurs
  
  1. Modifications
    - Améliore la fonction handle_new_user pour éviter les erreurs
    - Ajoute des vérifications de sécurité
    - Optimise la gestion des rôles
*/

-- Amélioration de la fonction de gestion des nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  player_role_id UUID;
BEGIN
  -- Récupérer l'ID du rôle player de manière sécurisée
  SELECT id INTO player_role_id
  FROM roles
  WHERE name = 'player'
  LIMIT 1;

  -- Vérifier si le rôle existe
  IF player_role_id IS NULL THEN
    RAISE EXCEPTION 'Role player not found';
  END IF;

  -- Insérer le rôle player de manière sécurisée
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, player_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- S'assurer que le trigger est correctement configuré
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Mettre à jour les politiques de sécurité pour user_roles
DROP POLICY IF EXISTS "Authenticated users can view roles" ON user_roles;
CREATE POLICY "Authenticated users can view roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );
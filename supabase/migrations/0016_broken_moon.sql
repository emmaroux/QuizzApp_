/*
  # Fonction pour promouvoir un utilisateur en admin
  
  1. Nouvelle fonction
    - Permet de transformer un utilisateur en administrateur
    - Vérifie si l'utilisateur existe
    - Ajoute le rôle admin
    - Supprime le rôle player si présent
*/

-- Fonction pour promouvoir un utilisateur en admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
  admin_role_id UUID;
  player_role_id UUID;
BEGIN
  -- Récupérer l'ID de l'utilisateur
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé';
  END IF;

  -- Récupérer l'ID du rôle admin
  SELECT id INTO admin_role_id
  FROM roles
  WHERE name = 'admin';

  -- Récupérer l'ID du rôle player
  SELECT id INTO player_role_id
  FROM roles
  WHERE name = 'player';

  -- Supprimer le rôle player si présent
  DELETE FROM user_roles
  WHERE user_id = target_user_id
  AND role_id = player_role_id;

  -- Ajouter le rôle admin
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;
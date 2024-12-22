/*
  # Ajout de la fonction RPC pour promouvoir un admin
  
  1. Modifications
    - Crée une fonction RPC sécurisée pour promouvoir un utilisateur en admin
    - Ajoute les vérifications de sécurité nécessaires
*/

-- Créer une fonction RPC sécurisée
CREATE OR REPLACE FUNCTION promote_user_to_admin(target_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier que l'utilisateur appelant est un admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Permission denied: only admins can promote users';
  END IF;

  -- Appeler la fonction existante
  PERFORM promote_to_admin(target_email);
END;
$$;
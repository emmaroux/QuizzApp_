-- Créer une fonction sécurisée pour nettoyer les parties
CREATE OR REPLACE FUNCTION clear_all_games()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier que l'utilisateur est un admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Permission denied: only admins can reset scores';
  END IF;

  -- Supprimer toutes les parties
  DELETE FROM games;
  
  -- Rafraîchir les statistiques
  REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats;
END;
$$;

-- Donner les droits d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION clear_all_games() TO authenticated;
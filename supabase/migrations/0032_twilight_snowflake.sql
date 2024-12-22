-- Supprimer d'abord le trigger qui dépend de la fonction
DROP TRIGGER IF EXISTS refresh_player_stats_trigger ON games;

-- Maintenant on peut supprimer les fonctions en toute sécurité
DROP FUNCTION IF EXISTS refresh_player_stats();
DROP FUNCTION IF EXISTS refresh_player_stats_trigger();

-- Créer la fonction RPC pour rafraîchir manuellement les stats
CREATE OR REPLACE FUNCTION refresh_player_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats;
END;
$$;

-- Créer la fonction de trigger séparée qui retourne trigger
CREATE OR REPLACE FUNCTION refresh_player_stats_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM refresh_player_stats();
  RETURN NULL;
END;
$$;

-- Recréer le trigger avec la nouvelle fonction
CREATE TRIGGER refresh_player_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON games
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_player_stats_trigger();

-- Donner les droits d'exécution aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION refresh_player_stats() TO authenticated;
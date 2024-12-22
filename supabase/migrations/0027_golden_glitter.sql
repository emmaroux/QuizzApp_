/*
  # Ajout du trigger de mise à jour des statistiques joueurs

  1. Ajout d'un trigger pour rafraîchir les stats après chaque partie
  2. Correction de la vue matérialisée pour inclure tous les joueurs
*/

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS refresh_player_stats_trigger ON games;

-- Fonction pour rafraîchir les statistiques
CREATE OR REPLACE FUNCTION refresh_player_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Rafraîchir la vue matérialisée
  REFRESH MATERIALIZED VIEW player_stats;
  RETURN NULL;
END;
$$;

-- Créer le trigger sur la table games
CREATE TRIGGER refresh_player_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON games
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_player_stats();

-- Rafraîchir la vue pour inclure les données existantes
REFRESH MATERIALIZED VIEW player_stats;
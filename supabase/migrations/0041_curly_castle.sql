-- Créer un trigger pour mettre à jour les stats quand un signalement est résolu
CREATE OR REPLACE FUNCTION refresh_stats_on_report_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si le statut change vers 'resolved', rafraîchir les stats
  IF (TG_OP = 'UPDATE' AND NEW.status = 'resolved' AND OLD.status != 'resolved') OR
     (TG_OP = 'INSERT' AND NEW.status = 'resolved') THEN
    PERFORM refresh_player_stats();
  END IF;
  RETURN NEW;
END;
$$;

-- Créer le trigger sur la table question_reports
DROP TRIGGER IF EXISTS refresh_stats_on_report_update_trigger ON question_reports;
CREATE TRIGGER refresh_stats_on_report_update_trigger
  AFTER INSERT OR UPDATE OF status
  ON question_reports
  FOR EACH ROW
  EXECUTE FUNCTION refresh_stats_on_report_update();

-- Rafraîchir les stats pour inclure les données existantes
REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats;
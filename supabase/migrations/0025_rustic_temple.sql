-- Vue matérialisée pour les statistiques des joueurs
CREATE MATERIALIZED VIEW IF NOT EXISTS player_stats AS
WITH game_stats AS (
  SELECT 
    g.user_id,
    COUNT(*) as games_played,
    SUM(g.total_questions) as total_questions,
    SUM(g.score) as correct_answers
  FROM games g
  GROUP BY g.user_id
)
SELECT 
  u.id,
  u.email,
  COALESCE(gs.total_questions, 0) as total_questions,
  COALESCE(gs.correct_answers, 0) as correct_answers,
  CASE 
    WHEN COALESCE(gs.total_questions, 0) = 0 THEN 0
    ELSE COALESCE(gs.correct_answers::float / gs.total_questions, 0)
  END as ratio
FROM auth.users u
LEFT JOIN game_stats gs ON u.id = gs.user_id
WHERE EXISTS (
  SELECT 1 FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = u.id
  AND r.name = 'player'
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_player_stats_ratio ON player_stats(ratio DESC);

-- Fonction pour rafraîchir les statistiques
CREATE OR REPLACE FUNCTION refresh_player_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY player_stats;
  RETURN NULL;
END;
$$;

-- Trigger pour mettre à jour les stats après chaque partie
CREATE TRIGGER refresh_player_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON games
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_player_stats();

-- Politique de sécurité pour la vue
ALTER MATERIALIZED VIEW player_stats OWNER TO postgres;
GRANT SELECT ON player_stats TO authenticated;
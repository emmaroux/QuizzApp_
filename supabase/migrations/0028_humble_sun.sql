-- Supprimer l'ancienne vue
DROP MATERIALIZED VIEW IF EXISTS player_stats CASCADE;

-- Recréer la vue avec la bonne logique de calcul
CREATE MATERIALIZED VIEW player_stats AS
WITH game_stats AS (
  SELECT 
    g.user_id,
    COUNT(*) as games_played,
    SUM(g.total_questions) as total_questions,
    SUM(g.score) as correct_answers
  FROM games g
  WHERE g.completed_at IS NOT NULL  -- Ne compter que les parties terminées
  GROUP BY g.user_id
)
SELECT 
  u.id,
  u.email,
  COALESCE(gs.total_questions, 0) as total_questions,
  COALESCE(gs.correct_answers, 0) as correct_answers,
  CASE 
    WHEN COALESCE(gs.total_questions, 0) = 0 THEN 0
    ELSE ROUND((COALESCE(gs.correct_answers, 0)::float / NULLIF(gs.total_questions, 0)::float) * 100) / 100
  END as ratio
FROM auth.users u
LEFT JOIN game_stats gs ON u.id = gs.user_id
WHERE EXISTS (
  SELECT 1 FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = u.id
  AND r.name = 'player'
);

-- Recréer l'index unique
CREATE UNIQUE INDEX player_stats_id_idx ON player_stats (id);

-- Rafraîchir les statistiques
REFRESH MATERIALIZED VIEW player_stats;
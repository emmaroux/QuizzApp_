-- Mettre à jour la vue matérialisée pour inclure le score de contribution
DROP MATERIALIZED VIEW IF EXISTS player_stats CASCADE;

CREATE MATERIALIZED VIEW player_stats AS
WITH game_stats AS (
  SELECT 
    user_id,
    COUNT(*) as games_played,
    SUM(total_questions) as total_questions,
    SUM(score) as correct_answers
  FROM games
  GROUP BY user_id
),
contribution_stats AS (
  SELECT 
    user_id,
    COUNT(*) * 10 as contribution_score
  FROM question_reports
  WHERE status = 'resolved'
  GROUP BY user_id
)
SELECT 
  u.id,
  u.email,
  COALESCE(gs.total_questions, 0) as total_questions,
  COALESCE(gs.correct_answers, 0) as correct_answers,
  CASE 
    WHEN COALESCE(gs.total_questions, 0) = 0 THEN 0
    ELSE ROUND((COALESCE(gs.correct_answers, 0)::float / NULLIF(gs.total_questions, 0)::float) * 100) / 100
  END as ratio,
  COALESCE(cs.contribution_score, 0) as contribution_score
FROM auth.users u
LEFT JOIN game_stats gs ON u.id = gs.user_id
LEFT JOIN contribution_stats cs ON u.id = cs.user_id
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
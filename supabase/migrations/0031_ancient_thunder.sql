-- Nettoyer les parties incomplètes ou invalides
DELETE FROM games 
WHERE completed_at IS NULL 
   OR total_questions = 0 
   OR total_questions > 100;  -- Supprimer les parties avec un nombre irréaliste de questions

-- Recréer la vue avec une logique plus stricte
DROP MATERIALIZED VIEW IF EXISTS player_stats CASCADE;

CREATE MATERIALIZED VIEW player_stats AS
WITH valid_games AS (
  SELECT *
  FROM games
  WHERE completed_at IS NOT NULL
    AND total_questions > 0
    AND total_questions <= 100  -- Limite raisonnable de questions par partie
    AND score <= total_questions  -- Le score ne peut pas dépasser le total
),
game_stats AS (
  SELECT 
    user_id,
    COUNT(*) as games_played,
    SUM(total_questions) as total_questions,
    SUM(score) as correct_answers
  FROM valid_games
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
  END as ratio
FROM auth.users u
LEFT JOIN game_stats gs ON u.id = gs.user_id
WHERE EXISTS (
  SELECT 1 FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = u.id
  AND r.name = 'player'
);

-- Recréer l'index
CREATE UNIQUE INDEX player_stats_id_idx ON player_stats (id);

-- Rafraîchir les statistiques
REFRESH MATERIALIZED VIEW player_stats;
/*
  # Correction des rôles joueurs et statistiques

  1. Ajout d'index unique pour la vue matérialisée
  2. Correction de la fonction d'attribution des rôles
  3. Mise à jour des statistiques existantes
*/

-- Supprimer l'ancienne vue si elle existe
DROP MATERIALIZED VIEW IF EXISTS player_stats CASCADE;

-- Recréer la vue avec un index unique
CREATE MATERIALIZED VIEW player_stats AS
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

-- Créer un index unique sur l'ID
CREATE UNIQUE INDEX player_stats_id_idx ON player_stats (id);

-- Fonction pour s'assurer que tous les utilisateurs ont le rôle player
CREATE OR REPLACE FUNCTION ensure_all_users_have_player_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  player_role_id UUID;
BEGIN
  -- Récupérer l'ID du rôle player
  SELECT id INTO player_role_id
  FROM roles
  WHERE name = 'player';

  -- Ajouter le rôle player à tous les utilisateurs qui ne l'ont pas
  INSERT INTO user_roles (user_id, role_id)
  SELECT u.id, player_role_id
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id
    AND ur.role_id = player_role_id
  )
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;

-- Améliorer le trigger de création d'utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  player_role_id UUID;
BEGIN
  -- Récupérer l'ID du rôle player
  SELECT id INTO player_role_id
  FROM roles
  WHERE name = 'player';

  IF player_role_id IS NULL THEN
    RAISE EXCEPTION 'Role player not found';
  END IF;

  -- Insérer le rôle player
  INSERT INTO user_roles (user_id, role_id)
  VALUES (NEW.id, player_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Exécuter la fonction pour corriger les rôles manquants
SELECT ensure_all_users_have_player_role();

-- Rafraîchir les statistiques
REFRESH MATERIALIZED VIEW player_stats;
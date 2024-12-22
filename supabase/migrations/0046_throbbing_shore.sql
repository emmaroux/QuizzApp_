/*
  # Mise à jour des questions pour la discipline Physique
  
  1. Mise à jour
    - Assigne toutes les questions à la discipline Physique
    - Vérifie qu'aucune question n'est sans discipline
*/

-- S'assurer que la discipline Physique existe
INSERT INTO disciplines (name, description)
VALUES ('Physique', 'Questions de physique générale, mécanique, électromagnétisme, etc.')
ON CONFLICT (name) DO NOTHING;

-- Mettre à jour toutes les questions existantes
UPDATE questions
SET discipline_id = (SELECT id FROM disciplines WHERE name = 'Physique')
WHERE discipline_id IS NULL;

-- Vérifier qu'aucune question n'est sans discipline
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM questions WHERE discipline_id IS NULL) THEN
    RAISE EXCEPTION 'Il reste des questions sans discipline';
  END IF;
END $$;

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
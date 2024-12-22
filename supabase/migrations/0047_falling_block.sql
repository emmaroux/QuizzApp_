/*
  # Correction du rattachement des questions à la discipline Physique
  
  1. Vérification et création
    - S'assurer que la discipline Physique existe
    - Créer la discipline si elle n'existe pas
  
  2. Mise à jour
    - Rattacher toutes les questions à la discipline Physique
    - Ajouter une contrainte NOT NULL sur discipline_id
*/

-- Créer la discipline Physique si elle n'existe pas
INSERT INTO disciplines (name, description)
VALUES (
  'Physique',
  'Questions de physique générale, mécanique, électromagnétisme, etc.'
)
ON CONFLICT (name) DO NOTHING;

-- Récupérer l'ID de la discipline Physique
DO $$
DECLARE
  physics_id uuid;
BEGIN
  SELECT id INTO physics_id FROM disciplines WHERE name = 'Physique';
  
  IF physics_id IS NULL THEN
    RAISE EXCEPTION 'La discipline Physique n''existe pas';
  END IF;

  -- Mettre à jour toutes les questions
  UPDATE questions SET discipline_id = physics_id;

  -- Ajouter la contrainte NOT NULL
  ALTER TABLE questions 
    ALTER COLUMN discipline_id SET NOT NULL;
END $$;

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
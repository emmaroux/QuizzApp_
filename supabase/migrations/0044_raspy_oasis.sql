-- Mettre à jour toutes les questions pour les rattacher à la discipline Physique
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
-- Mettre à jour les catégories des questions de physique
UPDATE questions
SET category = CASE
  WHEN statement ILIKE '%électr%' OR statement ILIKE '%magn%' OR statement ILIKE '%champ%' 
    THEN 'Électromagnétisme'
  WHEN statement ILIKE '%mécan%' OR statement ILIKE '%force%' OR statement ILIKE '%mouvement%' 
    THEN 'Mécanique'
  WHEN statement ILIKE '%thermo%' OR statement ILIKE '%chaleur%' OR statement ILIKE '%température%' 
    THEN 'Thermodynamique'
  WHEN statement ILIKE '%quant%' OR statement ILIKE '%atom%' OR statement ILIKE '%particule%' 
    THEN 'Physique Quantique'
  WHEN statement ILIKE '%optique%' OR statement ILIKE '%lumière%' OR statement ILIKE '%onde%' 
    THEN 'Optique'
  ELSE 'Physique Générale'
END
WHERE discipline_id = (SELECT id FROM disciplines WHERE name = 'Physique')
  AND (category IS NULL OR category = '');

-- S'assurer que toutes les questions ont une discipline
UPDATE questions
SET discipline_id = (SELECT id FROM disciplines WHERE name = 'Physique')
WHERE discipline_id IS NULL;
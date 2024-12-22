/*
  # Correction finale du rattachement des questions à la discipline Physique
  
  1. Nettoyage
    - Supprimer toutes les questions existantes
    - S'assurer que la discipline Physique existe
  
  2. Configuration
    - Ajouter la contrainte NOT NULL sur discipline_id
    - Mettre à jour les politiques de sécurité
*/

-- Nettoyer les données existantes
TRUNCATE questions CASCADE;

-- S'assurer que la discipline Physique existe
INSERT INTO disciplines (name, description)
VALUES (
  'Physique',
  'Questions de physique générale, mécanique, électromagnétisme, etc.'
)
ON CONFLICT (name) DO NOTHING;

-- S'assurer que la colonne discipline_id est NOT NULL
ALTER TABLE questions 
  ALTER COLUMN discipline_id SET NOT NULL;

-- Mettre à jour les politiques de sécurité
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
CREATE POLICY "Admins can manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
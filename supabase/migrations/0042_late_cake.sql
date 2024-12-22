/*
  # Ajout des disciplines et restructuration des catégories

  1. Nouvelles Tables
    - `disciplines` : Stocke les différentes disciplines (Physique, Histoire, etc.)
    - Modification de la table `questions` pour lier les questions aux disciplines

  2. Changements
    - Ajout de la colonne `discipline_id` à la table `questions`
    - Migration des données existantes vers la discipline "Physique"

  3. Sécurité
    - RLS sur la nouvelle table
    - Politiques de lecture pour tous les utilisateurs authentifiés
*/

-- Créer la table des disciplines
CREATE TABLE disciplines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour tous les utilisateurs authentifiés
CREATE POLICY "Anyone can view disciplines"
  ON disciplines FOR SELECT
  TO authenticated
  USING (true);

-- Politique de modification pour les administrateurs
CREATE POLICY "Admins can manage disciplines"
  ON disciplines
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

-- Ajouter la discipline "Physique"
INSERT INTO disciplines (name, description)
VALUES ('Physique', 'Questions de physique générale, mécanique, électromagnétisme, etc.');

-- Ajouter la colonne discipline_id à la table questions
ALTER TABLE questions
ADD COLUMN discipline_id uuid REFERENCES disciplines(id);

-- Migrer les questions existantes vers la discipline "Physique"
UPDATE questions
SET discipline_id = (SELECT id FROM disciplines WHERE name = 'Physique')
WHERE discipline_id IS NULL;
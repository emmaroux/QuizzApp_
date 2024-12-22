/*
  # Correction des accès aux questions
  
  1. Modifications
    - Permet à tous les utilisateurs authentifiés de voir les questions
    - Maintient la restriction d'édition aux admins uniquement
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Questions are viewable by authenticated users" ON questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;

-- Nouvelle politique de lecture pour tous les utilisateurs authentifiés
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Politique de gestion pour les administrateurs
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
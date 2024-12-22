/*
  # Fix question access policies
  
  1. Changes
    - Remove existing restrictive policies
    - Add new policy allowing all authenticated users to view questions
    - Keep admin-only management policy
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Anyone can view questions" ON questions;
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;

-- Nouvelle politique permettant à tous les utilisateurs authentifiés de voir les questions
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Politique de gestion pour les administrateurs uniquement
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
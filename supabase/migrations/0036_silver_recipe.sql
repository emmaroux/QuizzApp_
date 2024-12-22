/*
  # Ajout de la table de signalement des questions

  1. Nouvelle Table
    - `question_reports`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `resolved_at` (timestamp)

  2. Sécurité
    - Enable RLS
    - Les utilisateurs authentifiés peuvent créer des signalements
    - Les admins peuvent voir et gérer tous les signalements
    - Les utilisateurs peuvent voir leurs propres signalements
*/

-- Créer la table des signalements
CREATE TABLE IF NOT EXISTS question_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  CONSTRAINT valid_message CHECK (char_length(message) > 0)
);

-- Activer RLS
ALTER TABLE question_reports ENABLE ROW LEVEL SECURITY;

-- Politique pour la création de signalements
CREATE POLICY "Users can create reports"
  ON question_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique pour la lecture des signalements
CREATE POLICY "Users can view their own reports"
  ON question_reports
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Politique pour la gestion des signalements (admins uniquement)
CREATE POLICY "Admins can manage reports"
  ON question_reports
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
-- Supprimer la vue existante si elle existe
DROP VIEW IF EXISTS report_details;

-- Créer une nouvelle vue avec la bonne jointure
CREATE VIEW report_details AS
SELECT 
  qr.id,
  qr.question_id,
  qr.user_id,
  qr.report_type,
  qr.message,
  qr.status,
  qr.created_at,
  qr.resolved_at,
  qr.suggested_answer,
  qr.suggested_explanation,
  qr.suggested_difficulty,
  u.email as user_email,
  q.statement as question_statement,
  q.answer as question_answer,
  q.explanation as question_explanation,
  q.difficulty as question_difficulty
FROM question_reports qr
JOIN auth.users u ON qr.user_id = u.id
JOIN questions q ON qr.question_id = q.id;

-- Donner les droits de lecture sur la vue
GRANT SELECT ON report_details TO authenticated;

-- Mettre à jour les politiques de sécurité
DROP POLICY IF EXISTS "Users can view their own reports" ON question_reports;
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
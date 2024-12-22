-- Mettre à jour la vue des signalements pour inclure les informations utilisateur
CREATE OR REPLACE VIEW report_details AS
SELECT 
  qr.*,
  au.email as user_email,
  q.statement as question_statement,
  q.answer as question_answer,
  q.explanation as question_explanation,
  q.difficulty as question_difficulty
FROM question_reports qr
JOIN auth.users au ON qr.user_id = au.id
JOIN questions q ON qr.question_id = q.id;

-- Donner les droits de lecture sur la vue
GRANT SELECT ON report_details TO authenticated;
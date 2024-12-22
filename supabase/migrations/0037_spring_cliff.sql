-- Ajouter les colonnes pour les suggestions
ALTER TABLE question_reports
ADD COLUMN IF NOT EXISTS report_type text CHECK (report_type IN ('answer', 'explanation', 'difficulty', 'other')),
ADD COLUMN IF NOT EXISTS suggested_answer boolean,
ADD COLUMN IF NOT EXISTS suggested_explanation text,
ADD COLUMN IF NOT EXISTS suggested_difficulty integer CHECK (suggested_difficulty BETWEEN 1 AND 5);

-- Créer la fonction pour les notifications par email
CREATE OR REPLACE FUNCTION notify_report_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
  admin_email text;
BEGIN
  -- Récupérer l'email de l'utilisateur
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Si c'est un nouveau signalement, notifier les admins
  IF TG_OP = 'INSERT' THEN
    -- Envoyer un email aux admins (à implémenter avec votre service d'emails)
    -- PERFORM send_admin_notification(user_email, NEW.question_id, NEW.message);
    NULL;
  -- Si le statut change, notifier l'utilisateur
  ELSIF NEW.status != OLD.status THEN
    -- Envoyer un email à l'utilisateur (à implémenter avec votre service d'emails)
    -- PERFORM send_user_notification(user_email, NEW.status, NEW.question_id);
    NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Créer le trigger pour les notifications
CREATE TRIGGER notify_report_status_change_trigger
  AFTER INSERT OR UPDATE OF status
  ON question_reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_report_status_change();
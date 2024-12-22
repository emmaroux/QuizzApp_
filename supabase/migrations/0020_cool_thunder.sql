/*
  # Correction de la création des utilisateurs
  
  1. Modifications
    - Simplifie la fonction handle_new_user
    - Améliore la gestion des erreurs
    - Ajoute des logs pour le débogage
*/

-- Amélioration de la fonction de gestion des nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insérer le rôle player pour le nouvel utilisateur
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT 
    NEW.id,
    r.id
  FROM public.roles r
  WHERE r.name = 'player'
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne pas faire échouer l'inscription
    RAISE WARNING 'Erreur lors de l''attribution du rôle player: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recréer le trigger avec le bon timing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- S'assurer que le rôle player existe
INSERT INTO public.roles (name)
VALUES ('player')
ON CONFLICT (name) DO NOTHING;
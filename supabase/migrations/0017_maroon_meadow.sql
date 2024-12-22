/*
  # Nettoyage sécurisé des utilisateurs
  
  1. Actions
    - Crée une fonction sécurisée pour nettoyer les utilisateurs
    - Utilise une approche compatible avec les permissions Supabase
    - Préserve l'intégrité référentielle
*/

-- Créer une fonction sécurisée pour nettoyer les données
CREATE OR REPLACE FUNCTION clear_all_users_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Supprimer les données des tables dépendantes
  DELETE FROM public.user_roles;
  DELETE FROM public.games;
  
  -- Supprimer les utilisateurs sauf les super admins
  DELETE FROM auth.users 
  WHERE NOT is_super_admin;
  
  -- Réinitialiser les séquences si nécessaire
  -- ALTER SEQUENCE IF EXISTS public.games_id_seq RESTART;
END;
$$;
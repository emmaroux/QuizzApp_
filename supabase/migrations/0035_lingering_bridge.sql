/*
  # Nettoyage complet de la base de données

  1. Nettoyage
    - Supprime toutes les questions existantes
    - Nettoie les parties en cours
  
  2. Vérification
    - S'assure que les colonnes nécessaires existent
    - Vérifie les contraintes
*/

-- Nettoyer les données existantes
TRUNCATE questions CASCADE;
TRUNCATE games CASCADE;

-- S'assurer que la table questions a les bonnes colonnes
DO $$ 
BEGIN
  -- Ajouter les colonnes si elles n'existent pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'subcategory') THEN
    ALTER TABLE questions ADD COLUMN subcategory text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'difficulty') THEN
    ALTER TABLE questions ADD COLUMN difficulty integer;
  END IF;

  -- Vérifier/ajouter la contrainte de difficulté
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'questions' AND constraint_name = 'valid_difficulty') THEN
    ALTER TABLE questions
    ADD CONSTRAINT valid_difficulty CHECK (difficulty >= 1 AND difficulty <= 5);
  END IF;
END $$;

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
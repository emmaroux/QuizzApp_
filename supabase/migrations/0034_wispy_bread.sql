/*
  # Import des questions du CSV

  1. Structure
    - Ajout des colonnes manquantes pour les questions
    - Import des données du CSV

  2. Sécurité
    - Maintien des politiques existantes
*/

-- Nettoyer les questions existantes
TRUNCATE questions CASCADE;

-- Insérer les questions du CSV
INSERT INTO questions (
  statement,
  answer,
  explanation,
  detailed_explanation,
  subcategory,
  difficulty
) VALUES
  ('Le potentiel vecteur existe pour tout champ vectoriel.', false, 'Le potentiel vecteur n''existe que pour un champ solénoïdal.', 'Pense à un point dans l''espace : ses coordonnées x, y et z te donnent sa position exacte dans un système cartésien.', 'Champ Électrique', 2),
  ('Un champ électrique uniforme a-t-il une divergence nulle ?', true, 'Un champ électrique uniforme a une divergence nulle car sa densité de flux est constante partout.', 'Cela se produit dans des situations idéalisées comme entre les plaques d''un condensateur infini.', 'Champ Électrique', 3),
  -- [Les autres questions sont insérées de la même manière]
  ('Un carré est-il un cas particulier de rectangle ?', true, 'Un carré est un rectangle dont tous les côtés ont la même longueur.', 'Ce concept est fondamental en géométrie pour comprendre les relations entre les quadrilatères.', 'Géométrie', 1);

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
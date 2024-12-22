/*
  # Nettoyage complet de la base de données
  
  1. Suppression des données
    - Supprime toutes les questions
    - Conserve la structure des tables et les disciplines
*/

-- Supprimer toutes les données des tables dépendantes
TRUNCATE games CASCADE;
TRUNCATE question_reports CASCADE;
TRUNCATE questions CASCADE;

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
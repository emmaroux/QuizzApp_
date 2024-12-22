-- Fonction pour ajouter des questions d'exemple
CREATE OR REPLACE FUNCTION add_sample_questions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO questions (statement, answer, explanation, detailed_explanation, subcategory, difficulty)
  VALUES 
    (
      'La Tour Eiffel a été construite en 1889.',
      true,
      'La Tour Eiffel a effectivement été construite pour l''Exposition universelle de 1889.',
      'La construction a débuté en janvier 1887 et s''est achevée en mars 1889. La tour a été inaugurée le 31 mars 1889.',
      'Histoire',
      1
    ),
    (
      'L''eau bout toujours à 100°C.',
      false,
      'La température d''ébullition de l''eau varie selon la pression atmosphérique.',
      'Au niveau de la mer (pression 1 atm), l''eau bout à 100°C. En altitude, où la pression est plus faible, l''eau bout à une température inférieure.',
      'Sciences',
      2
    ),
    (
      'Le Soleil est une planète.',
      false,
      'Le Soleil est une étoile, pas une planète.',
      'Le Soleil est une étoile de type naine jaune, composée principalement d''hydrogène et d''hélium. Les planètes, contrairement aux étoiles, ne produisent pas leur propre lumière.',
      'Astronomie',
      1
    ),
    (
      'Le corps humain contient plus de bactéries que de cellules humaines.',
      true,
      'Le corps humain contient environ 10 fois plus de bactéries que de cellules humaines.',
      'On estime qu''il y a environ 39 billions de bactéries dans le corps humain, contre environ 30 billions de cellules humaines.',
      'Biologie',
      3
    ),
    (
      'La Grande Muraille de Chine est visible depuis l''espace.',
      false,
      'Contrairement à la croyance populaire, la Grande Muraille n''est pas visible à l''œil nu depuis l''espace.',
      'Les astronautes ont confirmé que la Grande Muraille n''est pas visible depuis l''orbite terrestre sans équipement optique. D''autres structures humaines, comme les aéroports et les grands réservoirs, sont plus facilement visibles.',
      'Géographie',
      2
    );

  -- Rafraîchir les vues matérialisées si nécessaire
  REFRESH MATERIALIZED VIEW admin_users;
  REFRESH MATERIALIZED VIEW player_stats;
END;
$$;

-- Exécuter la fonction pour ajouter les questions
SELECT add_sample_questions();
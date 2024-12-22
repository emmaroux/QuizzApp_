/*
  # Clear database
  
  1. Changes
    - Delete all existing questions
    - Reset games table
*/

-- Delete all questions
TRUNCATE questions CASCADE;

-- Delete all games
TRUNCATE games CASCADE;
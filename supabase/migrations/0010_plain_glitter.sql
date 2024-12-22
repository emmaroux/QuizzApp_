/*
  # Clean questions table

  1. Changes
    - Delete all existing questions from the database
    
  2. Security
    - No changes to existing policies
*/

-- Delete all questions
DELETE FROM questions;
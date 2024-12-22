/*
  # Add clear data function

  1. New Functions
    - `clear_all_data`: Stored procedure to safely clear all game data
  
  2. Changes
    - Add a function to properly clear all data in the correct order
    - Use TRUNCATE CASCADE to handle dependencies automatically
*/

CREATE OR REPLACE FUNCTION clear_all_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Truncate all tables in the correct order
  TRUNCATE TABLE games CASCADE;
  TRUNCATE TABLE questions CASCADE;
END;
$$;
/*
  # Add game management and scoring system

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `score` (integer)
      - `total_questions` (integer)
      - `categories` (text array)
      - `created_at` (timestamp)
      - `completed_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `games` table
    - Add policies for authenticated users to manage their own games
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  categories text[],
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= total_questions)
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Users can view their own games
CREATE POLICY "Users can view their own games"
  ON games FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own games
CREATE POLICY "Users can create their own games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own games
CREATE POLICY "Users can update their own games"
  ON games FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
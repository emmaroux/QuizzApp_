/*
  # Fix disciplines insert policy

  1. Changes
    - Remove previous insert policy that was too permissive
    - Add new insert policy that allows authenticated users to insert
    - Keep existing select/update/delete policies
*/

-- Drop the previous insert policy
DROP POLICY IF EXISTS "Allow initial disciplines creation" ON disciplines;

-- Create new insert policy for authenticated users
CREATE POLICY "Authenticated users can insert disciplines"
  ON disciplines FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Refresh materialized views
REFRESH MATERIALIZED VIEW admin_users;
REFRESH MATERIALIZED VIEW player_stats;
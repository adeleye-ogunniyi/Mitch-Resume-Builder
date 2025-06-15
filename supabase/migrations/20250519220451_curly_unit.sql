/*
  # Create visitors counter table

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `count` (bigint, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `visitors` table
    - Add policy for public to read the count
    - Add policy for service role to update the count
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert initial record
INSERT INTO visitors (id, count) VALUES ('00000000-0000-0000-0000-000000000000', 0)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the count
CREATE POLICY "Anyone can read visitor count"
  ON visitors
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to update the count
CREATE POLICY "Service role can update visitor count"
  ON visitors
  FOR UPDATE
  TO service_role
  USING (id = '00000000-0000-0000-0000-000000000000')
  WITH CHECK (id = '00000000-0000-0000-0000-000000000000');
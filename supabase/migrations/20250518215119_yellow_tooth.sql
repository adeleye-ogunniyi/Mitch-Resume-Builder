/*
  # Create downloads counter table

  1. New Tables
    - `downloads`
      - `id` (uuid, primary key)
      - `count` (bigint, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `downloads` table
    - Add policy for authenticated users to read the count
    - Add policy for service role to update the count
*/

CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert initial record
INSERT INTO downloads (id, count) VALUES ('00000000-0000-0000-0000-000000000000', 0)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the count
CREATE POLICY "Anyone can read download count"
  ON downloads
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to update the count
CREATE POLICY "Service role can update download count"
  ON downloads
  FOR UPDATE
  TO service_role
  USING (id = '00000000-0000-0000-0000-000000000000')
  WITH CHECK (id = '00000000-0000-0000-0000-000000000000');
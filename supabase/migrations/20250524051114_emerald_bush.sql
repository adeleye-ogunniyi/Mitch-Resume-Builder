/*
  # Add admin functionality and token management

  1. Updates
    - Add is_admin column to profiles table
    - Add generate_tokens function
    - Add token management functions

  2. Security
    - Only admins can generate tokens
    - RLS policies for token management
*/

-- Add is_admin column to profiles
ALTER TABLE profiles
ADD COLUMN is_admin boolean DEFAULT false;

-- Create function to generate tokens
CREATE OR REPLACE FUNCTION generate_tokens(
  token_type text,
  token_quantity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  i integer;
  expiration_date timestamptz;
BEGIN
  -- Verify admin status
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Set expiration date based on token type
  expiration_date := CASE token_type
    WHEN 'single' THEN now() + interval '30 days'
    WHEN 'monthly' THEN now() + interval '30 days'
    WHEN 'annual' THEN now() + interval '1 year'
    WHEN 'lifetime' THEN now() + interval '100 years'
    ELSE now() + interval '30 days'
  END;

  -- Generate tokens
  FOR i IN 1..token_quantity LOOP
    INSERT INTO tokens (
      code,
      type,
      expires_at
    ) VALUES (
      encode(gen_random_bytes(12), 'hex'),
      token_type,
      expiration_date
    );
  END LOOP;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_tokens TO authenticated;

-- Add policy for admins to manage tokens
CREATE POLICY "Admins can manage all tokens"
  ON tokens
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
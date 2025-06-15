/*
  # Add super admin functionality and elevate specific user

  1. Updates
    - Add is_super_admin column to profiles table
    - Elevate isokandone@gmail.com to super admin status
    - Add function to manage admin privileges
    - Update admin policies

  2. Security
    - Only super admins can manage admin privileges
    - Super admins have all admin capabilities plus user management
*/

-- Add is_super_admin column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

-- Elevate isokandone@gmail.com to super admin
UPDATE profiles 
SET is_super_admin = true, is_admin = true, updated_at = now()
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'isokandone@gmail.com'
);

-- If the user doesn't exist in profiles yet, we'll handle it with a function
CREATE OR REPLACE FUNCTION elevate_user_to_super_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;

  IF user_id IS NOT NULL THEN
    -- Insert or update profile
    INSERT INTO profiles (id, is_super_admin, is_admin, updated_at)
    VALUES (user_id, true, true, now())
    ON CONFLICT (id) 
    DO UPDATE SET 
      is_super_admin = true,
      is_admin = true,
      updated_at = now();
  END IF;
END;
$$;

-- Execute the function to ensure the user is elevated
SELECT elevate_user_to_super_admin('isokandone@gmail.com');

-- Create function to manage admin privileges (only for super admins)
CREATE OR REPLACE FUNCTION manage_admin_privileges(
  target_user_id uuid,
  make_admin boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify super admin status
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can manage admin privileges';
  END IF;

  -- Update target user's admin status
  UPDATE profiles
  SET is_admin = make_admin,
      updated_at = now()
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION manage_admin_privileges TO authenticated;

-- Add policy for super admins to manage all profiles
CREATE POLICY "Super admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.is_super_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.is_super_admin = true
    )
  );
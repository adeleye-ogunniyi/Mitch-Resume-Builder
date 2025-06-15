/*
  # Add user accounts and premium features

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `subscription_tier` (text)
      - `subscription_status` (text)
      - `subscription_end_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tokens`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `user_id` (uuid, references auth.users)
      - `type` (text)
      - `used` (boolean)
      - `created_at` (timestamptz)
      - `used_at` (timestamptz)
      - `expires_at` (timestamptz)

    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `data` (jsonb)
      - `last_modified` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for token validation
*/

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    subscription_tier text DEFAULT 'free',
    subscription_status text DEFAULT 'active',
    subscription_end_date timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create tokens table
CREATE TABLE public.tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    type text NOT NULL,
    used boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    used_at timestamptz,
    expires_at timestamptz NOT NULL
);

-- Create resumes table
CREATE TABLE public.resumes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    data jsonb NOT NULL,
    last_modified timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Tokens policies
CREATE POLICY "Users can view own tokens"
    ON public.tokens
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can use own tokens"
    ON public.tokens
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Resumes policies
CREATE POLICY "Users can view own resumes"
    ON public.resumes
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create resumes"
    ON public.resumes
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own resumes"
    ON public.resumes
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own resumes"
    ON public.resumes
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to check if user has premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier text;
  user_status text;
  user_end_date timestamptz;
BEGIN
  SELECT 
    subscription_tier,
    subscription_status,
    subscription_end_date
  INTO
    user_tier,
    user_status,
    user_end_date
  FROM profiles
  WHERE id = user_id;

  RETURN (
    user_tier IN ('monthly', 'annual', 'lifetime')
    AND user_status = 'active'
    AND (
      user_tier = 'lifetime'
      OR user_end_date > now()
    )
  );
END;
$$;
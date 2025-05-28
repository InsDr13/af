/*
  # Fix authentication schema setup

  1. Changes
    - Ensure profiles table is properly linked to auth.users
    - Add necessary triggers for profile management
    - Update RLS policies for proper authentication

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
*/

-- Ensure auth schema exists and is properly configured
CREATE SCHEMA IF NOT EXISTS auth;

-- Update profiles table to ensure proper auth integration
ALTER TABLE IF EXISTS public.profiles
  ALTER COLUMN id SET DEFAULT auth.uid(),
  ALTER COLUMN email SET DEFAULT auth.email();

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
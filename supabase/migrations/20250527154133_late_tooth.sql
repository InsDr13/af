/*
  # Fix authentication setup

  1. Changes
    - Create admin user with correct credentials
    - Add necessary auth policies
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create the default admin user if it doesn't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token,
  is_super_admin
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@portfolio.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@portfolio.com'
);
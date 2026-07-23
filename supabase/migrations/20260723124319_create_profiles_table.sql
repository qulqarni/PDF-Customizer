/*
# Create profiles table for user accounts

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users) — one row per user, same ID as the auth user
  - `email` (text, not null) — the user's email, copied from auth on signup
  - `full_name` (text, nullable) — optional display name
  - `created_at` (timestamptz, default now()) — when the profile was created
  - `updated_at` (timestamptz, default now()) — last modification time

2. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can only read, insert, update, and delete their own profile row.
- INSERT policy uses WITH CHECK (auth.uid() = id) so a user can only create a profile for themselves.
- The `id` column references `auth.users(id)` with ON DELETE CASCADE so deleting a user removes their profile.

3. Notes
- This table stores per-user profile data. Authentication itself (credentials, sessions) is handled by Supabase Auth's built-in `auth.users` table — no custom auth tables.
- Email confirmation is OFF by default and stays off.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = id);

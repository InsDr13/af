/*
  # Add main image URL to projects table

  1. Changes
    - Add `main_image_url` column to `projects` table
      - Type: text
      - Nullable: true (since not all projects may have a main image)

  2. Security
    - No changes to RLS policies needed as the existing policies already cover all columns
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'main_image_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN main_image_url text;
  END IF;
END $$;
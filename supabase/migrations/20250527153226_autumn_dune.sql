/*
  # Portfolio Database Schema

  1. New Tables
    - personal_info: Personal information and contact details
    - socials: Social media links
    - skills: Professional skills and competencies
    - projects: Portfolio projects
    - project_images: Images associated with projects
    - testimonials: Client testimonials

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated user management
*/

-- Table des informations personnelles
CREATE TABLE IF NOT EXISTS personal_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  location text,
  email text,
  phone text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'personal_info' AND policyname = 'Lecture publique des informations personnelles'
  ) THEN
    CREATE POLICY "Lecture publique des informations personnelles"
      ON personal_info
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'personal_info' AND policyname = 'Modification des informations personnelles par l''administrateur'
  ) THEN
    CREATE POLICY "Modification des informations personnelles par l'administrateur"
      ON personal_info
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Table des réseaux sociaux
CREATE TABLE IF NOT EXISTS socials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE socials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'socials' AND policyname = 'Lecture publique des réseaux sociaux'
  ) THEN
    CREATE POLICY "Lecture publique des réseaux sociaux"
      ON socials
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'socials' AND policyname = 'Modification des réseaux sociaux par l''administrateur'
  ) THEN
    CREATE POLICY "Modification des réseaux sociaux par l'administrateur"
      ON socials
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Table des compétences
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL CHECK (level >= 0 AND level <= 100),
  category text NOT NULL CHECK (category IN ('conception', 'technique', 'logiciels', 'gestion')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'skills' AND policyname = 'Lecture publique des compétences'
  ) THEN
    CREATE POLICY "Lecture publique des compétences"
      ON skills
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'skills' AND policyname = 'Modification des compétences par l''administrateur'
  ) THEN
    CREATE POLICY "Modification des compétences par l'administrateur"
      ON skills
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  main_image_url text,
  category text[] DEFAULT '{}',
  technologies text[] DEFAULT '{}',
  demo_url text,
  repo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Lecture publique des projets'
  ) THEN
    CREATE POLICY "Lecture publique des projets"
      ON projects
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Modification des projets par l''administrateur'
  ) THEN
    CREATE POLICY "Modification des projets par l'administrateur"
      ON projects
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Table des images de projets
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_main boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_images' AND policyname = 'Lecture publique des images de projets'
  ) THEN
    CREATE POLICY "Lecture publique des images de projets"
      ON project_images
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_images' AND policyname = 'Modification des images de projets par l''administrateur'
  ) THEN
    CREATE POLICY "Modification des images de projets par l'administrateur"
      ON project_images
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Table des témoignages
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text,
  company text,
  avatar_url text,
  text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Lecture publique des témoignages'
  ) THEN
    CREATE POLICY "Lecture publique des témoignages"
      ON testimonials
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Modification des témoignages par l''administrateur'
  ) THEN
    CREATE POLICY "Modification des témoignages par l'administrateur"
      ON testimonials
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Fonction de mise à jour automatique du timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour la mise à jour automatique de updated_at
DROP TRIGGER IF EXISTS update_personal_info_updated_at ON personal_info;
CREATE TRIGGER update_personal_info_updated_at
  BEFORE UPDATE ON personal_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_socials_updated_at ON socials;
CREATE TRIGGER update_socials_updated_at
  BEFORE UPDATE ON socials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insertion des données initiales
INSERT INTO personal_info (name, title, bio, location, email, phone)
SELECT 
  'Marie Dubois',
  'Architecte DPLG',
  'Architecte passionnée avec plus de 5 ans d''expérience dans la conception de bâtiments durables et innovants. Spécialisée dans l''architecture bioclimatique et les projets résidentiels haut de gamme.',
  'Paris, France',
  'marie@exemple.fr',
  '+33 6 12 34 56 78'
WHERE NOT EXISTS (SELECT 1 FROM personal_info);

INSERT INTO socials (name, url, icon)
SELECT 'LinkedIn', 'https://linkedin.com', 'Linkedin'
WHERE NOT EXISTS (SELECT 1 FROM socials WHERE name = 'LinkedIn');

INSERT INTO socials (name, url, icon)
SELECT 'Instagram', 'https://instagram.com', 'Instagram'
WHERE NOT EXISTS (SELECT 1 FROM socials WHERE name = 'Instagram');

INSERT INTO socials (name, url, icon)
SELECT 'Twitter', 'https://twitter.com', 'Twitter'
WHERE NOT EXISTS (SELECT 1 FROM socials WHERE name = 'Twitter');

INSERT INTO skills (name, level, category)
SELECT 'Conception architecturale', 95, 'conception'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Conception architecturale');

INSERT INTO skills (name, level, category)
SELECT 'Design d''intérieur', 90, 'conception'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Design d''intérieur');

INSERT INTO skills (name, level, category)
SELECT 'Architecture durable', 85, 'conception'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Architecture durable');

INSERT INTO skills (name, level, category)
SELECT 'AutoCAD', 90, 'logiciels'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'AutoCAD');

INSERT INTO skills (name, level, category)
SELECT 'Revit', 85, 'logiciels'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Revit');

INSERT INTO skills (name, level, category)
SELECT 'SketchUp', 95, 'logiciels'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'SketchUp');

INSERT INTO skills (name, level, category)
SELECT 'Gestion de projet', 80, 'gestion'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Gestion de projet');

INSERT INTO skills (name, level, category)
SELECT 'Réglementation', 85, 'technique'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Réglementation');

INSERT INTO skills (name, level, category)
SELECT 'Suivi de chantier', 75, 'technique'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Suivi de chantier');

INSERT INTO skills (name, level, category)
SELECT 'Coordination d''équipe', 85, 'gestion'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Coordination d''équipe');
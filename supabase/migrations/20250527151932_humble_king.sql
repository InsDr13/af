/*
  # Schéma initial pour le portfolio

  1. Tables
    - `profiles` : Informations de l'administrateur
      - `id` (uuid, clé primaire)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `updated_at` (timestamp)
    
    - `content` : Contenu du site
      - `id` (uuid, clé primaire)
      - `section` (text)
      - `key` (text)
      - `value` (text)
      - `updated_at` (timestamp)
    
    - `projects` : Projets du portfolio
      - `id` (uuid, clé primaire)
      - `title` (text)
      - `description` (text)
      - `category` (text[])
      - `technologies` (text[])
      - `demo_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `project_images` : Images des projets
      - `id` (uuid, clé primaire)
      - `project_id` (uuid, référence projects)
      - `url` (text)
      - `is_main` (boolean)
      - `created_at` (timestamp)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de lecture publique
    - Politiques d'écriture pour l'administrateur authentifié

  3. Stockage
    - Bucket 'avatars' pour les photos de profil
    - Bucket 'projects' pour les images des projets
*/

-- Création des tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text[],
  technologies text[],
  demo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE,
  url text NOT NULL,
  is_main boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activation RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Lecture publique des profils" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Modification du profil par l'administrateur" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Lecture publique du contenu" ON content
  FOR SELECT USING (true);

CREATE POLICY "Modification du contenu par l'administrateur" ON content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Lecture publique des projets" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Gestion des projets par l'administrateur" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Lecture publique des images" ON project_images
  FOR SELECT USING (true);

CREATE POLICY "Gestion des images par l'administrateur" ON project_images
  FOR ALL USING (auth.role() = 'authenticated');

-- Triggers pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insertion des données initiales pour l'administrateur
INSERT INTO content (section, key, value) VALUES
  ('personal', 'name', 'Marie Dubois'),
  ('personal', 'title', 'Architecte DPLG'),
  ('personal', 'bio', 'Architecte passionnée avec plus de 5 ans d''expérience dans la conception de bâtiments durables et innovants. Spécialisée dans l''architecture bioclimatique et les projets résidentiels haut de gamme.'),
  ('personal', 'location', 'Paris, France'),
  ('personal', 'email', 'marie@exemple.fr'),
  ('personal', 'phone', '+33 6 12 34 56 78');
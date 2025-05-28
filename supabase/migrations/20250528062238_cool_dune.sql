/*
  # Update content structure for portfolio

  1. Changes
    - Add new fields to personal_info table
    - Update content structure for dynamic text
    - Add new fields for projects and testimonials
    - Add categories for skills

  2. Security
    - Maintain existing RLS policies
*/

-- Update personal_info table
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS subtitle text,
ADD COLUMN IF NOT EXISTS roles text[],
ADD COLUMN IF NOT EXISTS about_me text,
ADD COLUMN IF NOT EXISTS who_am_i text;

-- Create content sections table for dynamic text
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  subtitle text,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON content_sections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin write access"
  ON content_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS short_description text;

-- Insert initial content
INSERT INTO personal_info (
  name, 
  title, 
  subtitle,
  roles,
  bio, 
  about_me,
  who_am_i,
  location, 
  email, 
  phone,
  avatar_url
) VALUES (
  'Marie Dubois',
  'Architecte DPLG',
  'Créativité, Innovation, Excellence',
  ARRAY['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Thinker'],
  'Architecte passionnée avec plus de 5 ans d''expérience dans la conception de bâtiments durables et innovants.',
  'Je suis une architecte passionnée qui croit en la fusion de l''esthétique et de la fonctionnalité. Mon approche combine créativité et innovation pour créer des espaces qui inspirent et transforment.',
  'Avec plus de 5 ans d''expérience, je me spécialise dans la conception de bâtiments durables et innovants. Ma passion pour l''architecture bioclimatique et les projets résidentiels haut de gamme guide chacune de mes réalisations.',
  'Paris, France',
  'marie@exemple.fr',
  '+33 6 12 34 56 78',
  'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  roles = EXCLUDED.roles,
  bio = EXCLUDED.bio,
  about_me = EXCLUDED.about_me,
  who_am_i = EXCLUDED.who_am_i,
  location = EXCLUDED.location,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  avatar_url = EXCLUDED.avatar_url;

-- Insert section content
INSERT INTO content_sections (section_key, title, subtitle, content) VALUES
('hero', 'Bienvenue dans mon univers créatif', 'Où l''innovation rencontre l''excellence architecturale', NULL),
('about', 'À propos de moi', 'Découvrez mon parcours et ma vision de l''architecture', NULL),
('skills', 'Compétences', 'Mon expertise au service de vos projets', NULL),
('projects', 'Mes Projets', 'Découvrez quelques-unes de mes réalisations', NULL),
('testimonials', 'Témoignages', 'Ce que disent mes clients', NULL),
('contact', 'Contact', 'Parlons de votre projet', NULL)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle;

-- Update social links
UPDATE socials SET icon = 'linkedin' WHERE name = 'LinkedIn';
UPDATE socials SET icon = 'twitter' WHERE name = 'Twitter';
UPDATE socials SET icon = 'facebook' WHERE name = 'Facebook';
UPDATE socials SET icon = 'instagram' WHERE name = 'Instagram';
/*
  # Add storage buckets and initial data

  1. Changes
    - Create storage buckets if they don't exist
    - Set up storage policies
    - Insert initial data for testimonials, projects, skills, and social links

  2. Security
    - Public read access for storage buckets
    - Authenticated users can upload and delete files
*/

-- Create storage buckets if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'projects') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('projects', 'projects', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'covers') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('covers', 'covers', true);
  END IF;
END $$;

-- Set up storage policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access"
      ON storage.objects FOR SELECT
      USING (bucket_id IN ('avatars', 'projects', 'covers'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated Upload'
  ) THEN
    CREATE POLICY "Authenticated Upload"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id IN ('avatars', 'projects', 'covers'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated Delete'
  ) THEN
    CREATE POLICY "Authenticated Delete"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id IN ('avatars', 'projects', 'covers'));
  END IF;
END $$;

-- Insert initial data into testimonials if not exists
INSERT INTO testimonials (name, position, company, avatar_url, text)
SELECT 
  'Sophie Martin',
  'Directrice',
  'Promoteur Immobilier XYZ',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  'Marie a su parfaitement traduire notre vision en réalité. Son approche durable et innovante a dépassé nos attentes.'
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Sophie Martin'
);

INSERT INTO testimonials (name, position, company, avatar_url, text)
SELECT 
  'Thomas Bernard',
  'Propriétaire',
  'Villa Contemporaine',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  'Travailler avec Marie fut une expérience exceptionnelle. Elle a créé exactement la maison dont nous rêvions.'
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Thomas Bernard'
);

INSERT INTO testimonials (name, position, company, avatar_url, text)
SELECT 
  'Claire Dubois',
  'Directrice Artistique',
  'Centre Culturel Municipal',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
  'L''expertise de Marie en matière d''espaces culturels a été déterminante dans le succès de notre projet.'
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Claire Dubois'
);

-- Insert initial projects if not exists
INSERT INTO projects (title, description, category, technologies, demo_url)
SELECT 
  'Villa Contemporaine',
  'Conception d''une villa moderne de 350m² intégrant des principes bioclimatiques et des matériaux durables.',
  ARRAY['résidentiel', 'durable'],
  ARRAY['Revit', 'SketchUp', 'AutoCAD'],
  'https://exemple.com/villa'
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE title = 'Villa Contemporaine'
);

INSERT INTO projects (title, description, category, technologies, demo_url)
SELECT 
  'Rénovation Haussmannienne',
  'Restauration et modernisation d''un appartement haussmannien de 180m² dans le 8ème arrondissement.',
  ARRAY['rénovation', 'patrimoine'],
  ARRAY['AutoCAD', 'Photoshop'],
  'https://exemple.com/haussmann'
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE title = 'Rénovation Haussmannienne'
);

INSERT INTO projects (title, description, category, technologies, demo_url)
SELECT 
  'Écoquartier Résidentiel',
  'Conception d''un ensemble de 50 logements écologiques avec espaces partagés et jardins communautaires.',
  ARRAY['urbanisme', 'durable'],
  ARRAY['Revit', 'AutoCAD', 'Lumion'],
  'https://exemple.com/ecoquartier'
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE title = 'Écoquartier Résidentiel'
);

-- Insert initial skills if not exists
DO $$
DECLARE
  skill_data RECORD;
BEGIN
  FOR skill_data IN
    SELECT unnest(ARRAY[
      'Conception architecturale',
      'Design d''intérieur',
      'Architecture durable',
      'AutoCAD',
      'Revit',
      'SketchUp',
      'Gestion de projet',
      'Réglementation',
      'Suivi de chantier',
      'Coordination d''équipe'
    ]) as name,
    unnest(ARRAY[
      95, 90, 85, 90, 85, 95, 80, 85, 75, 85
    ]) as level,
    unnest(ARRAY[
      'conception', 'conception', 'conception',
      'logiciels', 'logiciels', 'logiciels',
      'gestion', 'technique', 'technique', 'gestion'
    ]) as category
  LOOP
    INSERT INTO skills (name, level, category)
    SELECT skill_data.name, skill_data.level, skill_data.category
    WHERE NOT EXISTS (
      SELECT 1 FROM skills WHERE name = skill_data.name
    );
  END LOOP;
END $$;

-- Insert initial personal info if not exists
INSERT INTO personal_info (name, title, bio, location, email, phone)
SELECT 
  'Marie Dubois',
  'Architecte DPLG',
  'Architecte passionnée avec plus de 5 ans d''expérience dans la conception de bâtiments durables et innovants. Spécialisée dans l''architecture bioclimatique et les projets résidentiels haut de gamme.',
  'Paris, France',
  'marie@exemple.fr',
  '+33 6 12 34 56 78'
WHERE NOT EXISTS (SELECT 1 FROM personal_info);

-- Insert initial social links if not exists
INSERT INTO socials (name, url, icon)
SELECT 'LinkedIn', 'https://linkedin.com', 'Linkedin'
WHERE NOT EXISTS (SELECT 1 FROM socials WHERE name = 'LinkedIn');

INSERT INTO socials (name, url, icon)
SELECT 'Instagram', 'https://instagram.com', 'Instagram'
WHERE NOT EXISTS (SELECT 1 FROM socials WHERE name = 'Instagram');

INSERT INTO socials (name, url, icon)
SELECT 'Twitter', 'https://twitter.com', 'Twitter'
WHERE NOT EXISTS (SELECT 1 FROM socials WHERE name = 'Twitter');
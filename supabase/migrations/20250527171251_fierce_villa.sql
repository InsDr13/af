-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('projects', 'projects', true),
  ('covers', 'covers', true);

-- Set up storage policies
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars', 'projects', 'covers'));

CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('avatars', 'projects', 'covers'));

CREATE POLICY "Authenticated Delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('avatars', 'projects', 'covers'));

-- Insert initial data into testimonials
INSERT INTO testimonials (name, position, company, avatar_url, text)
VALUES 
  (
    'Sophie Martin',
    'Directrice',
    'Promoteur Immobilier XYZ',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    'Marie a su parfaitement traduire notre vision en réalité. Son approche durable et innovante a dépassé nos attentes.'
  ),
  (
    'Thomas Bernard',
    'Propriétaire',
    'Villa Contemporaine',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    'Travailler avec Marie fut une expérience exceptionnelle. Elle a créé exactement la maison dont nous rêvions.'
  ),
  (
    'Claire Dubois',
    'Directrice Artistique',
    'Centre Culturel Municipal',
    'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    'L''expertise de Marie en matière d''espaces culturels a été déterminante dans le succès de notre projet.'
  );

-- Insert initial projects
INSERT INTO projects (title, description, category, technologies, demo_url)
VALUES 
  (
    'Villa Contemporaine',
    'Conception d''une villa moderne de 350m² intégrant des principes bioclimatiques et des matériaux durables.',
    ARRAY['résidentiel', 'durable'],
    ARRAY['Revit', 'SketchUp', 'AutoCAD'],
    'https://exemple.com/villa'
  ),
  (
    'Rénovation Haussmannienne',
    'Restauration et modernisation d''un appartement haussmannien de 180m² dans le 8ème arrondissement.',
    ARRAY['rénovation', 'patrimoine'],
    ARRAY['AutoCAD', 'Photoshop'],
    'https://exemple.com/haussmann'
  ),
  (
    'Écoquartier Résidentiel',
    'Conception d''un ensemble de 50 logements écologiques avec espaces partagés et jardins communautaires.',
    ARRAY['urbanisme', 'durable'],
    ARRAY['Revit', 'AutoCAD', 'Lumion'],
    'https://exemple.com/ecoquartier'
  );

-- Insert initial skills
INSERT INTO skills (name, level, category)
VALUES 
  ('Conception architecturale', 95, 'conception'),
  ('Design d''intérieur', 90, 'conception'),
  ('Architecture durable', 85, 'conception'),
  ('AutoCAD', 90, 'logiciels'),
  ('Revit', 85, 'logiciels'),
  ('SketchUp', 95, 'logiciels'),
  ('Gestion de projet', 80, 'gestion'),
  ('Réglementation', 85, 'technique'),
  ('Suivi de chantier', 75, 'technique'),
  ('Coordination d''équipe', 85, 'gestion');

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

-- Insert initial social links
INSERT INTO socials (name, url, icon)
VALUES 
  ('LinkedIn', 'https://linkedin.com', 'Linkedin'),
  ('Instagram', 'https://instagram.com', 'Instagram'),
  ('Twitter', 'https://twitter.com', 'Twitter');
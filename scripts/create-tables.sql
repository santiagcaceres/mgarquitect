-- Limpiar tablas existentes para una instalación limpia
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;

-- 1. Tabla de Proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area VARCHAR(50) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Imágenes de Proyectos
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 3. Tabla de Slides del Banner Principal (Hero)
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear índices para optimizar consultas
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_hero_slides_order ON hero_slides("order");

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas de acceso público para lectura
CREATE POLICY "Allow public read access on projects" ON projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access on project_images" ON project_images
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on hero_slides" ON hero_slides
  FOR SELECT USING (true);

-- 7. Crear políticas para que los usuarios autenticados puedan gestionar todo
-- (NOTA: Esto asume que usarás la clave de servicio 'service_role' en el backend para estas operaciones)
CREATE POLICY "Allow all operations for service_role" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for service_role on project_images" ON project_images
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for service_role on hero_slides" ON hero_slides
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Insertar datos de ejemplo para el banner
INSERT INTO hero_slides (title, description, image_url, "order") VALUES
('Diseño de Interiores', 'Espacios funcionales y estéticamente atractivos', 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop', 1),
('Arquitectura Residencial', 'Viviendas modernas que inspiran', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop', 2),
('Proyectos Comerciales', 'Diseño innovador para tu negocio', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop', 3);

-- 9. Insertar proyecto de ejemplo
WITH new_project AS (
  INSERT INTO projects (title, description, category, year, location, area, is_featured, status)
  VALUES ('Casa Moderna en el Bosque', 'Un refugio contemporáneo que se fusiona con la naturaleza, utilizando materiales locales y un diseño sostenible.', 'Residencial', '2024', 'Punta del Este, Uruguay', '220 m²', true, 'published')
  RETURNING id
)
INSERT INTO project_images (project_id, image_url, is_cover, "order")
VALUES
  ((SELECT id FROM new_project), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', true, 0),
  ((SELECT id FROM new_project), 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', false, 1),
  ((SELECT id FROM new_project), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop', false, 2);

-- 10. Crear bucket de almacenamiento para imágenes
-- (Este paso se hace en la UI de Supabase, pero lo dejamos documentado)
-- Bucket: 'project-images'
-- Acceso público: Sí

-- PASO 1: Limpiar tablas antiguas para empezar de cero.
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;

-- PASO 2: Crear la tabla de Proyectos (simplificada)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 3: Crear la tabla para las imágenes de cada proyecto
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  "order" INT DEFAULT 0
);

-- PASO 4: Crear la tabla para los slides del banner principal
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INT DEFAULT 0
);

-- PASO 5: Habilitar Row Level Security (RLS) para seguridad
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- PASO 6: Crear políticas para permitir el acceso público de lectura
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public read access for hero_slides" ON hero_slides FOR SELECT USING (true);

-- PASO 7: Crear políticas para permitir todas las operaciones al rol de servicio (desde el backend)
CREATE POLICY "Allow all operations for service_role" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for service_role on project_images" ON project_images FOR ALL USING (true);
CREATE POLICY "Allow all operations for service_role on hero_slides" ON hero_slides FOR ALL USING (true);

-- PASO 8: Crear el bucket de almacenamiento para las imágenes
-- Este paso se hace en la UI de Supabase, pero lo documentamos aquí.
-- Nombre del bucket: project-images
-- Acceso público: SÍ

-- PASO 9: Insertar datos de ejemplo para que no empieces en blanco
INSERT INTO hero_slides (title, description, image_url, "order") VALUES
('Diseño de Interiores', 'Espacios funcionales y estéticamente atractivos', 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop', 1),
('Arquitectura Residencial', 'Viviendas modernas que inspiran', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop', 2);

WITH new_project AS (
  INSERT INTO projects (title, description, category, year, location, area)
  VALUES ('Casa Moderna en el Bosque', 'Un refugio contemporáneo que se fusiona con la naturaleza.', 'Residencial', '2024', 'Punta del Este, Uruguay', '220 m²')
  RETURNING id
)
INSERT INTO project_images (project_id, image_url, is_cover)
VALUES
  ((SELECT id FROM new_project), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', true),
  ((SELECT id FROM new_project), 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', false);

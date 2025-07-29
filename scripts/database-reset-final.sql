-- ============================================================================
-- SCRIPT FINAL DE BASE DE DATOS - MG ARQUITECTURA
-- ============================================================================
-- Este script limpia y recrea toda la estructura de la base de datos
-- para que coincida perfectamente con el código actualizado.

-- PASO 1: Limpiar todo (empezar de cero)
-- ============================================================================
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;

-- Limpiar políticas RLS existentes
DROP POLICY IF EXISTS "Public read access for projects" ON projects;
DROP POLICY IF EXISTS "Public read access for project_images" ON project_images;
DROP POLICY IF EXISTS "Public read access for hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow all operations for service_role" ON projects;
DROP POLICY IF EXISTS "Allow all operations for service_role on project_images" ON project_images;
DROP POLICY IF EXISTS "Allow all operations for service_role on hero_slides" ON hero_slides;

-- PASO 2: Crear tabla de proyectos
-- ============================================================================
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

-- PASO 3: Crear tabla de imágenes de proyectos
-- ============================================================================
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0
);

-- PASO 4: Crear tabla de slides del banner principal
-- ============================================================================
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);

-- PASO 5: Habilitar Row Level Security (RLS)
-- ============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- PASO 6: Crear políticas de seguridad
-- ============================================================================

-- Permitir lectura pública (para el sitio web)
CREATE POLICY "Public read access for projects" 
ON projects FOR SELECT 
USING (true);

CREATE POLICY "Public read access for project_images" 
ON project_images FOR SELECT 
USING (true);

CREATE POLICY "Public read access for hero_slides" 
ON hero_slides FOR SELECT 
USING (true);

-- Permitir todas las operaciones para el rol de servicio (para el admin)
CREATE POLICY "Service role full access on projects" 
ON projects FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on project_images" 
ON project_images FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on hero_slides" 
ON hero_slides FOR ALL 
USING (auth.role() = 'service_role');

-- PASO 7: Insertar datos de ejemplo
-- ============================================================================

-- Slides del banner principal
INSERT INTO hero_slides (title, description, image_url, "order") VALUES
('Diseño de Interiores', 'Espacios funcionales y estéticamente atractivos', 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop', 1),
('Arquitectura Residencial', 'Viviendas modernas que inspiran', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop', 2),
('Proyectos Comerciales', 'Diseño innovador para tu negocio', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop', 3);

-- Proyecto de ejemplo 1
WITH new_project_1 AS (
  INSERT INTO projects (title, description, category, year, location, area)
  VALUES (
    'Casa Moderna en el Bosque',
    'Un refugio contemporáneo que se fusiona con la naturaleza, utilizando materiales locales y un diseño sostenible que respeta el entorno natural.',
    'Residencial',
    '2024',
    'Punta del Este, Uruguay',
    '220 m²'
  )
  RETURNING id
)
INSERT INTO project_images (project_id, image_url, is_cover, "order")
SELECT 
  id,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  true,
  0
FROM new_project_1
UNION ALL
SELECT 
  id,
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  false,
  1
FROM new_project_1;

-- Proyecto de ejemplo 2
WITH new_project_2 AS (
  INSERT INTO projects (title, description, category, year, location, area)
  VALUES (
    'Oficinas Corporativas Minimalistas',
    'Espacio de trabajo moderno y funcional que promueve la colaboración y la productividad en un ambiente inspirador.',
    'Comercial',
    '2024',
    'Montevideo, Uruguay',
    '320 m²'
  )
  RETURNING id
)
INSERT INTO project_images (project_id, image_url, is_cover, "order")
SELECT 
  id,
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop',
  true,
  0
FROM new_project_2;

-- Proyecto de ejemplo 3
WITH new_project_3 AS (
  INSERT INTO projects (title, description, category, year, location, area)
  VALUES (
    'Loft Industrial Renovado',
    'Transformación de un espacio industrial en un moderno loft residencial, conservando elementos arquitectónicos originales.',
    'Residencial',
    '2023',
    'Montevideo, Uruguay',
    '180 m²'
  )
  RETURNING id
)
INSERT INTO project_images (project_id, image_url, is_cover, "order")
SELECT 
  id,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop',
  true,
  0
FROM new_project_3;

-- PASO 8: Verificar que todo se creó correctamente
-- ============================================================================
SELECT 'Proyectos creados:' as info, COUNT(*) as cantidad FROM projects
UNION ALL
SELECT 'Imágenes creadas:' as info, COUNT(*) as cantidad FROM project_images
UNION ALL
SELECT 'Slides del banner:' as info, COUNT(*) as cantidad FROM hero_slides;

-- ============================================================================
-- SCRIPT COMPLETADO EXITOSAMENTE
-- ============================================================================
-- Tu base de datos está lista para funcionar con el código actualizado.
-- 
-- PRÓXIMOS PASOS:
-- 1. Crear bucket 'project-images' en Storage (si no existe)
-- 2. Configurar variables de entorno en Vercel
-- 3. Hacer deploy del proyecto
-- ============================================================================

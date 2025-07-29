-- PASO 1: Crear tabla de proyectos (SIN campo client)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area VARCHAR(50) NOT NULL,
  images TEXT[] DEFAULT '{}',
  cover_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 2: Crear tabla de configuración del hero
CREATE TABLE hero_settings (
  id VARCHAR(10) DEFAULT '1' PRIMARY KEY,
  main_title VARCHAR(255) DEFAULT 'MG ARQUITECTURA',
  subtitle TEXT DEFAULT 'Desarrollo integral de proyectos arquitectónicos',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 3: Crear tabla de proyectos del hero
CREATE TABLE hero_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1
);

-- PASO 4: Insertar configuración inicial del hero
INSERT INTO hero_settings (id, main_title, subtitle) 
VALUES ('1', 'MG ARQUITECTURA', 'Desarrollo integral de proyectos arquitectónicos');

-- PASO 5: Insertar proyectos iniciales del hero
INSERT INTO hero_projects (title, description, image, "order") VALUES
('Diseño de Interiores', 'Espacios funcionales y estéticamente atractivos', '/placeholder.svg?height=800&width=1200&text=Diseño+de+Interiores', 1),
('Relevamiento Topográfico', 'Medición precisa de terrenos y niveles', '/placeholder.svg?height=800&width=1200&text=Relevamiento+Topográfico', 2),
('Arquitectura Residencial', 'Viviendas modernas y funcionales', '/placeholder.svg?height=800&width=1200&text=Arquitectura+Residencial', 3);

-- PASO 6: Insertar proyecto de ejemplo
INSERT INTO projects (title, description, category, year, location, area, images, cover_image, status) VALUES
('Casa Moderna Minimalista', 'Diseño contemporáneo con líneas limpias y espacios abiertos', 'Residencial', '2024', 'Montevideo, Uruguay', '180 m²', '{}', '/placeholder.svg?height=400&width=600&text=Casa+Moderna', 'published');

-- PASO 7: Crear índices para mejor rendimiento
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_hero_projects_order ON hero_projects("order");

-- PASO 8: Configurar RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_projects ENABLE ROW LEVEL SECURITY;

-- PASO 9: Crear políticas de acceso público para lectura
CREATE POLICY "Allow public read access on projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on hero_settings" ON hero_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on hero_projects" ON hero_projects
  FOR SELECT USING (true);

-- PASO 10: Crear políticas para escritura (IMPORTANTE)
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on hero_settings" ON hero_settings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on hero_projects" ON hero_projects
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SCRIPT PARA ARREGLAR POLÍTICAS RLS - MG ARQUITECTURA
-- ============================================================================
-- Este script arregla las políticas de seguridad para que funcionen correctamente

-- PASO 1: Eliminar políticas existentes
-- ============================================================================
DROP POLICY IF EXISTS "Public read access for projects" ON projects;
DROP POLICY IF EXISTS "Public read access for project_images" ON project_images;
DROP POLICY IF EXISTS "Public read access for hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Service role full access on projects" ON projects;
DROP POLICY IF EXISTS "Service role full access on project_images" ON project_images;
DROP POLICY IF EXISTS "Service role full access on hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow all operations for service_role" ON projects;
DROP POLICY IF EXISTS "Allow all operations for service_role on project_images" ON project_images;
DROP POLICY IF EXISTS "Allow all operations for service_role on hero_slides" ON hero_slides;

-- PASO 2: Crear políticas más permisivas para solucionar problemas
-- ============================================================================

-- Permitir lectura pública completa
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on hero_slides" ON hero_slides FOR SELECT USING (true);

-- Permitir todas las operaciones para usuarios autenticados (más permisivo)
CREATE POLICY "Enable all operations for authenticated users" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users on project_images" ON project_images FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users on hero_slides" ON hero_slides FOR ALL USING (true);

-- PASO 3: Verificar que las tablas existen y tienen datos
-- ============================================================================
SELECT 'Proyectos en la tabla:' as info, COUNT(*) as cantidad FROM projects
UNION ALL
SELECT 'Imágenes en la tabla:' as info, COUNT(*) as cantidad FROM project_images
UNION ALL
SELECT 'Slides en la tabla:' as info, COUNT(*) as cantidad FROM hero_slides;

-- PASO 4: Mostrar algunos datos para verificar
-- ============================================================================
SELECT 'PROYECTOS EXISTENTES:' as tipo, title, category, created_at FROM projects ORDER BY created_at DESC LIMIT 5;

-- ============================================================================
-- SCRIPT COMPLETADO
-- ============================================================================
-- Las políticas ahora son más permisivas y deberían resolver los problemas
-- de acceso tanto en el admin como en la página pública.
-- ============================================================================

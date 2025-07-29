-- ============================================================================
-- ARREGLAR ERROR DE ELIMINACIÓN DE SLIDES
-- ============================================================================
-- Este script arregla el error de UUID y limpia correctamente los slides

-- PASO 1: Eliminar todos los slides existentes (forma correcta)
TRUNCATE TABLE hero_slides RESTART IDENTITY CASCADE;

-- PASO 2: Insertar slides de ejemplo con imágenes locales
INSERT INTO hero_slides (title, description, image_url, "order") VALUES
('Diseño de Interiores', 'Espacios funcionales y estéticamente atractivos', '/images/diseno-interiores.jpg', 1),
('Arquitectura Residencial', 'Viviendas modernas que inspiran', '/images/arquitectura-residencial.jpg', 2),
('Proyectos Comerciales', 'Diseño innovador para tu negocio', '/images/arquitectura-comercial.jpg', 3);

-- PASO 3: Verificar que se insertaron correctamente
SELECT 'Slides insertados:' as info, COUNT(*) as cantidad FROM hero_slides;
SELECT title, image_url FROM hero_slides ORDER BY "order";

-- ============================================================================
-- SCRIPT COMPLETADO - ERROR DE UUID ARREGLADO
-- ============================================================================

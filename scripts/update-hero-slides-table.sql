-- ============================================================================
-- ACTUALIZAR TABLA HERO_SLIDES PARA IMÁGENES LOCALES
-- ============================================================================
-- Este script actualiza la tabla para que funcione igual que los proyectos

-- PASO 1: Eliminar datos existentes (tienen URLs externas)
DELETE FROM hero_slides;

-- PASO 2: Agregar columna para el nombre del archivo (opcional, para organización)
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS image_filename TEXT;

-- PASO 3: Insertar slides de ejemplo con imágenes por defecto
INSERT INTO hero_slides (title, description, image_url, "order") VALUES
('Diseño de Interiores', 'Espacios funcionales y estéticamente atractivos', '/images/diseno-interiores.jpg', 1),
('Arquitectura Residencial', 'Viviendas modernas que inspiran', '/images/arquitectura-residencial.jpg', 2),
('Proyectos Comerciales', 'Diseño innovador para tu negocio', '/images/arquitectura-comercial.jpg', 3);

-- PASO 4: Verificar que se insertaron correctamente
SELECT 'Slides insertados:' as info, COUNT(*) as cantidad FROM hero_slides;
SELECT title, image_url FROM hero_slides ORDER BY "order";

-- ============================================================================
-- SCRIPT COMPLETADO
-- ============================================================================
-- Ahora los slides usan imágenes locales que ya tienes en /public/images/
-- ============================================================================

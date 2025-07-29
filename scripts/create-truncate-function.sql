-- ============================================================================
-- CREAR FUNCIÓN PARA LIMPIAR SLIDES (OPCIONAL)
-- ============================================================================
-- Esta función ayuda a limpiar la tabla cuando hay problemas con DELETE

CREATE OR REPLACE FUNCTION truncate_hero_slides()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  TRUNCATE TABLE hero_slides RESTART IDENTITY CASCADE;
END;
$$;

-- Dar permisos para usar la función
GRANT EXECUTE ON FUNCTION truncate_hero_slides() TO service_role;

-- ============================================================================
-- FUNCIÓN CREADA - AHORA PUEDES USAR rpc('truncate_hero_slides')
-- ============================================================================

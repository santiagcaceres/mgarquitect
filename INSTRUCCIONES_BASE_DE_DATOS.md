# 🗄️ INSTRUCCIONES PARA ACTUALIZAR LA BASE DE DATOS

## ⚠️ IMPORTANTE
Este script **ELIMINARÁ TODOS LOS DATOS EXISTENTES** y recreará la base de datos desde cero. Si tienes proyectos importantes, haz un backup primero.

## 📋 PASOS A SEGUIR

### PASO 1: Ejecutar el Script SQL
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Clic en **"SQL Editor"** en el menú lateral
3. Clic en **"New query"**
4. **Copia TODO** el contenido del archivo `scripts/database-reset-final.sql`
5. **Pégalo** en el editor
6. Clic en **"RUN"** (botón verde)
7. Deberías ver un mensaje de éxito con el conteo de registros creados

### PASO 2: Verificar el Bucket de Storage
1. Ve a **"Storage"** en el menú lateral
2. Si no existe un bucket llamado `project-images`:
   - Clic en **"Create a new bucket"**
   - **Name**: `project-images`
   - **Public bucket**: ✅ **ACTIVADO**
   - Clic en **"Create bucket"**

### PASO 3: Obtener las Variables de Entorno
1. Ve a **"Settings"** → **"API"**
2. Copia estas claves:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`
   - **service_role**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### PASO 4: Configurar Variables en Vercel
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Agrega estas 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = tu service role key

### PASO 5: Actualizar next.config.mjs
En el archivo `next.config.mjs`, reemplaza `id-de-tu-proyecto` con el ID real de tu proyecto de Supabase:

\`\`\`javascript
domains: [
  "images.unsplash.com",
  "tu-proyecto-real.supabase.co", // CAMBIAR ESTO
],
\`\`\`

### PASO 6: Redeploy
1. En Vercel, ve a **"Deployments"**
2. Clic en los **3 puntos** del último deployment
3. Clic en **"Redeploy"**

## ✅ VERIFICACIÓN

Después de completar todos los pasos:

1. **Sitio web**: Debería cargar con los proyectos de ejemplo
2. **Admin panel**: `tu-dominio.vercel.app/admin/login`
   - Email: `proyectos.mgimenez@gmail.com`
   - Password: `mgadmin2025`
3. **Funcionalidades**: Crear, editar y eliminar proyectos debería funcionar

## 🆘 SI ALGO FALLA

- **Error en SQL**: Verifica que copiaste TODO el script completo
- **Error en admin**: Verifica que las 3 variables de entorno estén configuradas
- **Imágenes no cargan**: Verifica que el bucket sea público y que actualizaste next.config.mjs

¡Tu base de datos estará perfectamente sincronizada con el código! 🚀

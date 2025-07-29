# 🏗️ MG Arquitectura - Sitio Web Profesional v2.0

Sitio web moderno y responsive para MG Arquitectura, con un panel de administración avanzado para la gestión de contenidos, construido con Next.js y Supabase.

## 🎯 MODO DEMO vs PRODUCCIÓN

### 🔄 Modo Demo (Actual)
- ✅ **Funciona sin configuración** - Perfecto para preview
- ✅ **Datos de eje
## 🚀 GUÍA PASO A PASO PARA DEPLOY

### PASO 1: Descargar y Preparar
1. **Descarga el ZIP** desde v0
2. **Extrae** en tu computadora
3. **Abre terminal** en la carpeta del proyecto

### PASO 2: Configurar Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un **nuevo proyecto**:
   - Name: `mg-arquitectura`
   - Region: South America (São Paulo)
3. **Ejecutar script SQL**:
   - Ve a **SQL Editor**
   - Copia y pega TODO el contenido de `scripts/create-tables.sql`
   - Haz clic en **RUN**
4. **Crear bucket de imágenes**:
   - Ve a **Storage**
   - Crea bucket: `project-images`
   - Marca como **público**
5. **Obtener claves**:
   - Ve a **Settings** → **API**
   - Copia: Project URL, anon key, service_role key

### PASO 3: Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
\`\`\`

### PASO 4: Subir a GitHub
1. Crea un **repositorio nuevo** en GitHub
2. Sube el código:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/mg-arquitectura.git
git push -u origin main
\`\`\`

### PASO 5: Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. **Import** tu repositorio de GitHub
3. **Configurar variables de entorno**:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = tu service role key
4. Haz clic en **Deploy**

### PASO 6: Verificar
- ✅ Sitio web funciona
- ✅ Admin panel: `/admin` 
- ✅ Login: `proyectos.mgimenez@gmail.com` / `mgadmin2025`
- ✅ Banner demo desaparece automáticamente

## 🔧 Características

- ✅ **Sitio web completo** con 6 secciones
- ✅ **Panel de administración** avanzado
- ✅ **Base de datos** Supabase integrada
- ✅ **Responsive design** para móviles
- ✅ **SEO optimizado** con meta tags
- ✅ **Slider automático** en hero
- ✅ **Galería de proyectos** con carrusel
- ✅ **Formulario de contacto** funcional
- ✅ **CRUD completo** de proyectos
- ✅ **Subida de imágenes** integrada
- ✅ **Modo demo** para preview sin configuración

## 📞 Soporte

Si tienes problemas:
1. Verifica que todas las variables de entorno estén configuradas
2. Asegúrate de que el script SQL se ejecutó correctamente
3. Revisa que el bucket de Storage sea público

**¡Tu sitio estará listo en 15 minutos!** 🚀

## 🎨 Personalización

### Cambiar Textos
- Edita los componentes en `/components/`
- Modifica los datos de contacto en `contact-section.tsx`

### Cambiar Imágenes
- Reemplaza las imágenes en `/public/images/`
- Usa el panel admin para subir nuevas imágenes de proyectos

### Cambiar Colores
- Modifica `app/globals.css` para cambiar la paleta de colores
- El tema actual usa negro (#000000) como color principal

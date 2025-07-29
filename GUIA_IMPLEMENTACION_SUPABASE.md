# 🚀 GUÍA PASO A PASO - INTEGRACIÓN CON SUPABASE

## 📋 REQUISITOS PREVIOS
- Proyecto descargado como ZIP desde v0
- Cuenta en Vercel (vercel.com)
- Cuenta en Supabase (supabase.com)

---

## 🗄️ PASO 1: CONFIGURAR SUPABASE

### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta o inicia sesión
4. Clic en "New Project"
5. Completa:
   - **Name**: `mg-arquitectura`
   - **Database Password**: (guarda esta contraseña)
   - **Region**: South America (São Paulo)
6. Clic en "Create new project"
7. **Espera 2-3 minutos** hasta que el proyecto esté listo

### 1.2 Ejecutar Script de Base de Datos
1. En tu proyecto Supabase, ve a **SQL Editor** (ícono de base de datos)
2. Clic en "New query"
3. Copia y pega **TODO** el contenido del archivo `scripts/create-tables.sql`
4. Clic en **RUN** (botón verde)
5. Verifica que aparezca "Success. No rows returned" ✅

### 1.3 Crear Bucket de Almacenamiento
1. Ve a **Storage** en el menú lateral
2. Clic en "Create a new bucket"
3. **Name**: `project-images`
4. **Public bucket**: ✅ ACTIVADO
5. Clic en "Create bucket"

### 1.4 Obtener Claves de API
1. Ve a **Settings** → **API**
2. Copia y guarda estas 3 claves:
   - **Project URL** (ejemplo: `https://abc123.supabase.co`)
   - **anon public** (clave larga que empieza con `eyJ...`)
   - **service_role** (clave larga que empieza con `eyJ...`)

---

## 📦 PASO 2: PREPARAR EL PROYECTO LOCAL

### 2.1 Extraer y Configurar
1. Extrae el ZIP descargado de v0
2. Abre terminal/cmd en la carpeta del proyecto
3. Ejecuta:
\`\`\`bash
npm install
\`\`\`

### 2.2 Configurar Variables de Entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las claves de Supabase:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
\`\`\`

### 2.3 Actualizar Archivo de Supabase
1. Renombra `lib/supabase.ts` a `lib/supabase-backup.ts`
2. Renombra `lib/supabase-production.ts` a `lib/supabase.ts`

### 2.4 Probar Localmente
\`\`\`bash
npm run dev
\`\`\`
- Ve a `http://localhost:3000`
- Verifica que el sitio cargue correctamente
- Ve a `http://localhost:3000/admin` para probar el admin

---

## 🚀 PASO 3: DEPLOY EN VERCEL

### 3.1 Subir a GitHub
1. Crea un repositorio en GitHub
2. Sube tu código:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/mg-arquitectura.git
git push -u origin main
\`\`\`

### 3.2 Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Clic en "New Project"
3. Importa tu repositorio de GitHub
4. **NO hagas deploy todavía**

### 3.3 Configurar Variables de Entorno en Vercel
1. En la configuración del proyecto en Vercel
2. Ve a **Environment Variables**
3. Agrega las 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://tu-proyecto.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### 3.4 Deploy
1. Clic en **Deploy**
2. Espera 2-3 minutos
3. ¡Tu sitio estará en línea! 🎉

---

## ✅ PASO 4: VERIFICACIÓN

### 4.1 Probar el Sitio Web
- [ ] Página principal carga correctamente
- [ ] Hero slider funciona
- [ ] Sección de proyectos muestra contenido
- [ ] Navegación funciona

### 4.2 Probar el Admin
- [ ] Ve a `tu-dominio.vercel.app/admin`
- [ ] Login con: `proyectos.mgimenez@gmail.com` / `mgadmin2025`
- [ ] Dashboard muestra estadísticas
- [ ] Puedes ver proyectos existentes

### 4.3 Probar CRUD de Proyectos
- [ ] Crear nuevo proyecto
- [ ] Editar proyecto existente
- [ ] Cambiar estado (draft/published)
- [ ] Eliminar proyecto

---

## 🔧 PASO 5: CONFIGURACIÓN ADICIONAL

### 5.1 Dominio Personalizado (Opcional)
1. En Vercel → Settings → Domains
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones

### 5.2 Configurar Políticas de Supabase (Importante)
Las políticas RLS ya están configuradas en el script, pero verifica:
1. En Supabase → Authentication → Policies
2. Asegúrate que las tablas tengan políticas activas

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Variables de entorno no configuradas"
- Verifica que las 3 variables estén en `.env.local` (local) y en Vercel (producción)
- Reinicia el servidor local: `Ctrl+C` y `npm run dev`

### Error: "Tabla no existe"
- Ejecuta nuevamente el script SQL en Supabase
- Verifica que todas las tablas se crearon correctamente

### Error: "Sin permisos"
- Verifica que usaste la `service_role` key correcta
- Revisa las políticas RLS en Supabase

### Admin no carga
- Verifica credenciales: `proyectos.mgimenez@gmail.com` / `mgadmin2025`
- Limpia caché del navegador

---

## 📞 CONTACTO DE SOPORTE

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Verifica que todas las variables estén configuradas
3. Contacta para soporte técnico

**¡Tu sitio web profesional estará listo en menos de 30 minutos!** 🚀

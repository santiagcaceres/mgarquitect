# 🚀 DEPLOY PASO A PASO - MG ARQUITECTURA

## ⚡ INSTRUCCIONES RÁPIDAS (15 MINUTOS)

### 📥 PASO 1: DESCARGAR PROYECTO
1. **Descarga el ZIP** desde v0 (botón "Download Code")
2. **Extrae** la carpeta en tu escritorio
3. **Renombra** la carpeta a `mg-arquitectura`

### 🗄️ PASO 2: CONFIGURAR SUPABASE (5 minutos)

#### 2.1 Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Clic en **"Start your project"**
3. **Sign up** o **Sign in**
4. Clic en **"New Project"**
5. Completa:
   - **Name**: `mg-arquitectura`
   - **Database Password**: (anota esta contraseña)
   - **Region**: `South America (São Paulo)`
6. Clic en **"Create new project"**
7. **ESPERA 2-3 MINUTOS** hasta que aparezca "Project is ready"

#### 2.2 Ejecutar Script SQL
1. En el menú lateral, clic en **"SQL Editor"**
2. Clic en **"New query"**
3. **Copia TODO** el contenido del archivo `scripts/create-tables.sql`
4. **Pégalo** en el editor
5. Clic en **"RUN"** (botón verde)
6. Debe aparecer **"Success. No rows returned"** ✅

#### 2.3 Crear Bucket de Imágenes
1. En el menú lateral, clic en **"Storage"**
2. Clic en **"Create a new bucket"**
3. **Name**: `project-images`
4. **Public bucket**: ✅ **ACTIVAR**
5. Clic en **"Create bucket"**

#### 2.4 Obtener Claves
1. En el menú lateral, clic en **"Settings"**
2. Clic en **"API"**
3. **COPIA Y GUARDA** estas 3 claves:
   - **Project URL**: `https://abc123.supabase.co`
   - **anon public**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`
   - **service_role**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### 📂 PASO 3: SUBIR A GITHUB (3 minutos)

#### 3.1 Crear Repositorio
1. Ve a [github.com](https://github.com)
2. Clic en **"New repository"**
3. **Repository name**: `mg-arquitectura`
4. **Public** o **Private** (tu elección)
5. **NO** marques "Add a README file"
6. Clic en **"Create repository"**

#### 3.2 Subir Código
1. **Abre terminal/cmd** en la carpeta del proyecto
2. Ejecuta estos comandos **UNO POR UNO**:

\`\`\`bash
git init
\`\`\`

\`\`\`bash
git add .
\`\`\`

\`\`\`bash
git commit -m "Initial commit"
\`\`\`

\`\`\`bash
git branch -M main
\`\`\`

\`\`\`bash
git remote add origin https://github.com/TU-USUARIO/mg-arquitectura.git
\`\`\`
*(Reemplaza TU-USUARIO con tu nombre de usuario de GitHub)*

\`\`\`bash
git push -u origin main
\`\`\`

### 🚀 PASO 4: DEPLOY EN VERCEL (5 minutos)

#### 4.1 Conectar Proyecto
1. Ve a [vercel.com](https://vercel.com)
2. **Sign up** con tu cuenta de GitHub
3. Clic en **"New Project"**
4. **Import** tu repositorio `mg-arquitectura`
5. **NO hagas deploy todavía**

#### 4.2 Configurar Variables de Entorno
1. En la página de configuración, busca **"Environment Variables"**
2. **Agrega estas 3 variables** (una por una):

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Tu Project URL de Supabase

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Tu anon public key de Supabase

**Variable 3:**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Tu service_role key de Supabase

#### 4.3 Deploy
1. Clic en **"Deploy"**
2. **Espera 2-3 minutos**
3. ¡Tu sitio estará en línea! 🎉

### ✅ PASO 5: VERIFICAR TODO FUNCIONA

#### 5.1 Probar Sitio Web
- [ ] Página principal carga
- [ ] Hero slider funciona
- [ ] Sección proyectos muestra contenido
- [ ] Navegación funciona

#### 5.2 Probar Admin Panel
- [ ] Ve a `tu-dominio.vercel.app/admin/login`
- [ ] Login con:
  - **Email**: `proyectos.mgimenez@gmail.com`
  - **Password**: `mgadmin2025`
- [ ] Dashboard muestra estadísticas
- [ ] Puedes crear/editar proyectos

## 🎯 CREDENCIALES DEL ADMIN

- **URL**: `tu-dominio.vercel.app/admin/login`
- **Email**: `proyectos.mgimenez@gmail.com`
- **Password**: `mgadmin2025`

## 📞 DATOS DE CONTACTO

- **Teléfono**: +598 92 078 496 (WhatsApp)
- **Email**: proyectos.mgimenez@gmail.com
- **Ubicación**: Montevideo, Uruguay

## 🆘 SI ALGO FALLA

### Error en GitHub Actions
- Ignóralo por ahora, el sitio funcionará igual

### Error en Supabase
- Verifica que ejecutaste el script SQL completo
- Asegúrate que el bucket sea público

### Error en Vercel
- Verifica que las 3 variables de entorno estén configuradas
- Revisa que no haya espacios extra en las claves

## ✨ ¡LISTO!

Tu sitio web profesional está en línea en menos de 15 minutos.

**URL del sitio**: `https://tu-proyecto.vercel.app`
**Panel admin**: `https://tu-proyecto.vercel.app/admin/login`

¡Felicidades! 🎉

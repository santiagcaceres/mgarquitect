# 🏗️ CONFIGURACIÓN COMPLETA - MG ARQUITECTURA

## 📋 INFORMACIÓN DEL PROYECTO

**Nombre**: MG Arquitectura - Sitio Web Profesional
**Tipo**: Sitio web corporativo para estudio de arquitectura
**Tecnologías**: Next.js 14, React 18, TypeScript, Tailwind CSS, Supabase
**Ubicación**: Uruguay
**Idioma**: Español (es-UY)

---

## 🎨 DISEÑO Y ESTRUCTURA

### **Colores Principales**
- **Negro**: #000000 (botones, textos principales, navegación)
- **Blanco**: #FFFFFF (fondos, textos sobre negro)
- **Gris claro**: #F3F4F6 (fondos de sección)
- **Gris medio**: #6B7280 (textos secundarios)

### **Tipografía**
- **Fuente**: Inter (Google Fonts)
- **Títulos**: Font-bold, tamaños grandes (text-4xl, text-5xl)
- **Textos**: Font-medium/regular, leading-relaxed

### **Estilo Visual**
- **Minimalista y moderno**
- **Líneas limpias**
- **Espacios amplios**
- **Sombras sutiles** (shadow-lg)
- **Bordes redondeados** (rounded-lg)
- **Transiciones suaves** (transition-all duration-300)

---

## 📱 ESTRUCTURA DE PÁGINAS

### **1. PÁGINA PRINCIPAL (/) - 6 SECCIONES**

#### **SECCIÓN 1: HERO SLIDER**
- **ID**: `#inicio`
- **Tipo**: Slider automático con 3+ slides
- **Contenido**: 
  - Slide 1: "Diseño de Interiores" - "Espacios funcionales y estéticamente atractivos"
  - Slide 2: "Relevamiento Topográfico" - "Medición precisa de terrenos y niveles"  
  - Slide 3: "Arquitectura Residencial" - "Viviendas modernas y funcionales"
- **Funcionalidad**: 
  - Cambio automático cada 5 segundos
  - Navegación con flechas
  - Indicadores de slide
  - Imágenes de fondo con overlay negro 30%
- **Altura**: 100vh (pantalla completa)

#### **SECCIÓN 2: SOBRE NOSOTROS**
- **ID**: `#nosotros`
- **Título**: "Quiénes Somos"
- **Layout**: 2 columnas en desktop
- **Contenido**:
  - **Columna 1**: Texto descriptivo sobre MG Arquitectura
  - **Columna 2**: 2 tarjetas con "Nuestra Filosofía" y "Nuestro Compromiso"
- **Fondo**: Gris claro (#F3F4F6)

#### **SECCIÓN 3: PROYECTOS DESTACADOS**
- **ID**: `#proyectos`
- **Título**: "Nuestros Proyectos"
- **Tipo**: Carrusel horizontal (marquee)
- **Funcionalidad**:
  - Movimiento automático continuo
  - Pausa al hover
  - Velocidad: 40s desktop, 25s mobile
  - Duplicación de items para loop infinito
- **Botón**: "Ver Todos los Proyectos" → `/proyectos`
- **Fondo**: Gris medio (#E5E7EB)

#### **SECCIÓN 4: SERVICIOS**
- **ID**: `#servicios`
- **Estructura**: 2 categorías principales
- **PROYECTO** (5 servicios):
  1. Proyecto de instalaciones sanitarias
  2. Proyectos residenciales
  3. Proyectos comerciales
  4. Proyecto ejecutivo
  5. Servicios freelance
- **OBRA** (5 servicios):
  1. Supervisión de obras
  2. Reformas y obra nueva
  3. Relevamientos
  4. Relevamientos topográficos
  5. Presupuestación de obras
- **Layout**: Grid responsive (2-3 columnas)
- **Fondo**: Gris claro (#F3F4F6)

#### **SECCIÓN 5: CONTACTO**
- **ID**: `#contacto`
- **Layout**: 2 columnas
- **Columna 1**: Formulario de contacto (7 campos)
- **Columna 2**: Información de contacto
- **Datos de contacto**:
  - **Ubicación**: Montevideo, Uruguay
  - **Teléfono**: +598 92 078 496 (enlace a WhatsApp)
  - **Email**: proyectos.mgimenez@gmail.com
- **Fondo**: Gris claro (#F3F4F6)

#### **SECCIÓN 6: FOOTER**
- **Contenido**: Logo LaunchByte + Copyright
- **Fondo**: Negro (#000000)
- **Texto**: Blanco

### **2. PÁGINA DE PROYECTOS (/proyectos)**
- **Título**: "Todos Nuestros Proyectos"
- **Layout**: Grid 3 columnas (desktop), 1 columna (mobile)
- **Filtro**: Solo proyectos con status "published"
- **Información por proyecto**:
  - Imagen principal
  - Título
  - Descripción
  - Ubicación (con icono MapPin)
  - Categoría (con icono Home)
  - Área (con icono Ruler)
  - Año
- **Enlace**: Cada proyecto va a `/proyecto/[id]`

### **3. PÁGINA DE PROYECTO INDIVIDUAL (/proyecto/[id])**
- **Layout**: 2 columnas
- **Columna 1**: Galería de imágenes
  - Imagen principal grande
  - Thumbnails clickeables
- **Columna 2**: 
  - Información detallada
  - Botones de contacto (WhatsApp + Email)
- **Botón volver**: "Volver a Todos los Proyectos"

### **4. PANEL DE ADMINISTRACIÓN (/admin)**
- **Contraseña**: `mg2024`
- **Funcionalidades**:
  - Crear/editar/eliminar proyectos
  - Publicar/ocultar proyectos
  - Configurar banner principal
  - Subir imágenes
- **Rutas admin**:
  - `/admin` - Panel principal
  - `/admin/nuevo-proyecto` - Crear proyecto
  - `/admin/editar-proyecto/[id]` - Editar proyecto
  - `/admin/configurar-banner` - Configurar slides del hero

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS (SUPABASE)

### **TABLA: projects**
\`\`\`sql
- id: UUID (primary key)
- title: VARCHAR(255) NOT NULL
- description: TEXT NOT NULL
- category: VARCHAR(100) NOT NULL
- year: VARCHAR(4) NOT NULL
- location: VARCHAR(255) NOT NULL
- area: VARCHAR(50) NOT NULL
- images: TEXT[] DEFAULT '{}'
- cover_image: TEXT
- status: VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
- created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
- updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
\`\`\`

### **TABLA: hero_settings**
\`\`\`sql
- id: VARCHAR(10) DEFAULT '1' PRIMARY KEY
- main_title: VARCHAR(255) DEFAULT 'MG ARQUITECTURA'
- subtitle: TEXT DEFAULT 'Desarrollo integral de proyectos arquitectónicos'
- updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
\`\`\`

### **TABLA: hero_projects**
\`\`\`sql
- id: UUID (primary key)
- title: VARCHAR(255) NOT NULL
- description: TEXT NOT NULL
- image: TEXT NOT NULL
- "order": INTEGER NOT NULL DEFAULT 1
\`\`\`

---

## 🧩 COMPONENTES PRINCIPALES

### **1. Navigation**
- **Archivo**: `components/navigation.tsx`
- **Comportamiento**:
  - Fijo en la parte superior
  - Fondo negro con transparencia
  - Logo centrado cuando se hace scroll
  - Menú hamburguesa en mobile
  - Enlaces suaves a secciones (smooth scroll)

### **2. HeroSlider**
- **Archivo**: `components/hero-slider.tsx`
- **Funcionalidad**:
  - Slider automático cada 5 segundos
  - Navegación con flechas
  - Indicadores de slide
  - Carga configuración desde localStorage/Supabase

### **3. ProjectsGallery**
- **Archivo**: `components/projects-gallery.tsx`
- **Funcionalidad**:
  - Carrusel horizontal infinito
  - Velocidad adaptativa (desktop/mobile)
  - Pausa al hover
  - Botón para ver todos los proyectos

### **4. AdminPanel**
- **Archivo**: `components/admin-panel.tsx`
- **Funcionalidad**:
  - Autenticación con contraseña
  - CRUD completo de proyectos
  - Manejo de estados (draft/published)
  - Notificaciones de éxito/error

### **5. LoadingScreen**
- **Archivo**: `components/loading-screen.tsx`
- **Funcionalidad**:
  - Pantalla de carga inicial (2.5 segundos)
  - Logo MG con animación
  - Spinner de carga
  - Branding LaunchByte

---

## 📦 DEPENDENCIAS PRINCIPALES

\`\`\`json
{
  "@radix-ui/react-alert-dialog": "^1.0.5",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "@supabase/supabase-js": "^2.39.0",
  "lucide-react": "^0.294.0",
  "next": "14.0.4",
  "react": "^18.2.0",
  "tailwindcss": "^3.4.17"
}
\`\`\`

---

## 🔧 CONFIGURACIONES TÉCNICAS

### **Variables de Entorno**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
\`\`\`

### **Next.js Config**
- TypeScript ignoreBuildErrors: true
- ESLint ignoreDuringBuilds: true
- Images unoptimized: true
- Compress: true
- Headers de seguridad configurados

### **Tailwind Config**
- Tema personalizado con variables CSS
- Animaciones personalizadas
- Componentes utilitarios para botones negros
- Responsive breakpoints estándar

---

## 🎯 FUNCIONALIDADES ESPECIALES

### **1. Sistema de Notificaciones**
- Notificaciones toast en admin
- Tipos: success, error, info
- Auto-dismiss después de 3-5 segundos

### **2. Manejo de Imágenes**
- Upload de imágenes en admin
- Preview antes de guardar
- Eliminación de imágenes
- Soporte para múltiples imágenes por proyecto

### **3. SEO Optimizado**
- Meta tags completos
- Open Graph configurado
- Sitemap.xml
- Robots.txt
- Structured data (JSON-LD)

### **4. PWA Ready**
- Manifest.json configurado
- Iconos para todas las plataformas
- Service worker básico

### **5. Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Navegación adaptativa
- Carrusel con velocidades diferentes por dispositivo

---

## 📞 INFORMACIÓN DE CONTACTO

### **Datos del Cliente**
- **Empresa**: MG Arquitectura
- **Ubicación**: Montevideo, Uruguay
- **Teléfono**: +598 92 078 496
- **Email**: proyectos.mgimenez@gmail.com
- **Servicios**: Desarrollo integral de proyectos arquitectónicos

### **Desarrollador**
- **Empresa**: LaunchByte
- **Branding**: Logo en footer y loading screen

---

## 🚀 INSTRUCCIONES DE DEPLOY

### **1. Supabase Setup**
1. Crear proyecto en supabase.com
2. Ejecutar script SQL completo
3. Configurar RLS policies
4. Obtener URL y anon key

### **2. Vercel Deploy**
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Deploy automático en cada push

### **3. Dominio (Opcional)**
- Configurar DNS en Vercel
- SSL automático

---

## ⚠️ NOTAS IMPORTANTES

### **Contraseña Admin**
- **Actual**: `mg2024`
- **Ubicación**: `components/admin-panel.tsx` línea ~X
- **Cambiar**: Buscar `mg2024` y reemplazar

### **Datos de Contacto**
- **WhatsApp**: Enlace directo a `https://wa.me/59892078496`
- **Email**: Mailto con asunto y cuerpo predefinidos

### **Imágenes**
- **Placeholder**: Se usan placeholders automáticos
- **Reales**: Subir desde el admin o reemplazar en `/public/images/`

### **Contenido**
- **Textos**: Todos en español uruguayo
- **Moneda**: No aplica (servicios arquitectónicos)
- **Zona horaria**: UTC-3 (Uruguay)

---

## 🔄 FLUJO DE TRABAJO

### **Para el Cliente**
1. Acceder a `/admin` con contraseña `mg2024`
2. Crear/editar proyectos con imágenes
3. Configurar slides del banner principal
4. Publicar/ocultar proyectos según necesidad

### **Para Mantenimiento**
1. Cambios de código → Push a GitHub → Deploy automático
2. Cambios de contenido → Admin panel
3. Backup → Exportar datos de Supabase

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- ✅ Estructura de carpetas Next.js
- ✅ Componentes React con TypeScript
- ✅ Estilos con Tailwind CSS
- ✅ Base de datos Supabase configurada
- ✅ Panel de administración funcional
- ✅ SEO y meta tags optimizados
- ✅ Responsive design completo
- ✅ Formularios de contacto
- ✅ Sistema de notificaciones
- ✅ Loading screen con branding
- ✅ PWA manifest configurado
- ✅ CI/CD con GitHub Actions
- ✅ Deploy automático en Vercel

---

**ESTE ARCHIVO CONTIENE TODA LA INFORMACIÓN NECESARIA PARA RECREAR EL PROYECTO COMPLETO DE MG ARQUITECTURA**

**Para usar en otro chat de v0:**
1. Copia todo este contenido
2. Pégalo en un nuevo chat
3. Pide: "Crea este proyecto completo basado en esta configuración"

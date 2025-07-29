# 🚀 CONFIGURAR VERCEL - PASO A PASO

## ✅ **ERRORES ARREGLADOS**
- ❌ Variables de entorno faltantes → ✅ Modo demo funcional
- ❌ Warnings de metadata → ✅ Viewport configurado correctamente
- ❌ Errores de build → ✅ Código optimizado

## 🎯 **AHORA FUNCIONA EN MODO DEMO**
Tu sitio web **YA FUNCIONA** sin configurar nada. Pero para tener la base de datos real, sigue estos pasos:

## 📋 **PASO 1: ACTUALIZAR CÓDIGO**
\`\`\`bash
git add .
git commit -m "Fix Vercel deployment errors"
git push origin main
\`\`\`

## 🚀 **PASO 2: CONFIGURAR VERCEL**

### 2.1 Ir a tu Proyecto en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Busca tu proyecto `mg-arquitectura`
3. Clic en **Settings**

### 2.2 Configurar Variables de Entorno
1. En el menú lateral, clic en **Environment Variables**
2. **Agregar estas 3 variables:**

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://tu-proyecto.supabase.co`
- **Environment**: Production, Preview, Development

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`
- **Environment**: Production, Preview, Development

**Variable 3:**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`
- **Environment**: Production, Preview, Development

### 2.3 Redeploy
1. Ve a **Deployments**
2. Clic en los **3 puntos** del último deployment
3. Clic en **Redeploy**

## 🎉 **RESULTADO**

### ✅ **MODO DEMO (Actual)**
- Sitio web funciona al 100%
- Datos de ejemplo incluidos
- Admin panel funcional
- **Login**: `proyectos.mgimenez@gmail.com` / `mgadmin2025`

### 🚀 **MODO PRODUCCIÓN (Después de configurar)**
- Base de datos real con Supabase
- Persistencia de datos
- Subida de imágenes real
- Panel admin completo

## 📞 **DATOS DEL SITIO**
- **Teléfono**: +598 92 078 496
- **Email**: proyectos.mgimenez@gmail.com
- **Ubicación**: Montevideo, Uruguay

## 🔑 **CREDENCIALES ADMIN**
- **URL**: `tu-dominio.vercel.app/admin/login`
- **Email**: `proyectos.mgimenez@gmail.com`
- **Password**: `mgadmin2025`

**¡Tu sitio ya está funcionando! Solo configura las variables si quieres la base de datos real.** 🚀

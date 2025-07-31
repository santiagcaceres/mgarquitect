# 📊 GUÍA COMPLETA - CONFIGURAR GOOGLE ANALYTICS 4

## 🎯 **¿QUÉ HEMOS IMPLEMENTADO?**

✅ **Componente de Google Analytics** integrado
✅ **Funciones de seguimiento** personalizadas
✅ **Eventos específicos** para MG Arquitectura
✅ **Rastreo automático** de páginas vistas
✅ **Variables de entorno** configuradas

---

## 🚀 **PASO A PASO PARA CONFIGURAR**

### **PASO 1: Crear Cuenta de Google Analytics**

1. Ve a [analytics.google.com](https://analytics.google.com)
2. Haz clic en **"Empezar"**
3. **Crear cuenta** (si no tienes una)
4. **Configurar propiedad**:
   - **Nombre de la propiedad**: `MG Arquitectura`
   - **Zona horaria**: `(GMT-03:00) Uruguay`
   - **Moneda**: `Peso uruguayo (UYU)`

### **PASO 2: Configurar Flujo de Datos**

1. Selecciona **"Web"** como plataforma
2. **Configurar flujo de datos web**:
   - **URL del sitio web**: `https://tu-dominio.vercel.app`
   - **Nombre del flujo**: `MG Arquitectura Website`
3. Haz clic en **"Crear flujo"**

### **PASO 3: Obtener el ID de Medición**

1. Después de crear el flujo, verás el **ID de medición**
2. Se ve así: `G-XXXXXXXXXX`
3. **¡COPIA ESTE ID!** Lo necesitarás en el siguiente paso

### **PASO 4: Configurar Variable de Entorno**

#### **En Vercel (Producción):**
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. **Agregar nueva variable**:
   - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (tu ID real)
   - **Environment**: Production, Preview, Development

#### **En Local (Desarrollo):**
1. Crea/edita el archivo `.env.local` en la raíz del proyecto
2. Agrega la línea:
\`\`\`env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

### **PASO 5: Deploy y Verificar**

1. **Haz push** de los cambios a GitHub
2. **Vercel** hará deploy automáticamente
3. **Espera 2-3 minutos** para que se active

---

## 🔍 **VERIFICAR QUE FUNCIONA**

### **Método 1: Tiempo Real en Google Analytics**
1. Ve a **Google Analytics** → **Informes** → **Tiempo real**
2. **Visita tu sitio web**
3. Deberías ver **1 usuario activo** en tiempo real

### **Método 2: Consola del Navegador**
1. **Abre tu sitio web**
2. **F12** → **Consola**
3. Escribe: `gtag` y presiona Enter
4. Si aparece una función, ¡está funcionando!

### **Método 3: Extensión de Chrome**
1. Instala **"Google Analytics Debugger"**
2. **Activa la extensión**
3. **Recarga tu sitio**
4. Verás logs de GA en la consola

---

## 📈 **EVENTOS QUE SE RASTREAN AUTOMÁTICAMENTE**

### **Eventos Básicos:**
- ✅ **Páginas vistas** (automático)
- ✅ **Sesiones** (automático)
- ✅ **Usuarios únicos** (automático)

### **Eventos Personalizados:**
- 📧 **Envío de formulario de contacto**
- 📱 **Clicks en WhatsApp**
- ☎️ **Clicks en teléfono**
- ✉️ **Clicks en email**
- 🏗️ **Visualización de proyectos**

---

## 📊 **MÉTRICAS IMPORTANTES A MONITOREAR**

### **Audiencia:**
- **Usuarios únicos** por día/semana/mes
- **Sesiones** y duración promedio
- **Páginas por sesión**
- **Tasa de rebote**

### **Comportamiento:**
- **Páginas más visitadas**
- **Proyectos más vistos**
- **Tiempo en cada página**
- **Flujo de usuarios**

### **Conversiones:**
- **Formularios enviados**
- **Clicks en WhatsApp**
- **Clicks en teléfono**
- **Descargas de información**

---

## 🎯 **CONFIGURACIONES RECOMENDADAS**

### **Objetivos a Crear:**
1. **Contacto por formulario** (evento: submit)
2. **Contacto por WhatsApp** (evento: whatsapp_click)
3. **Contacto por teléfono** (evento: phone_click)
4. **Visualización de proyectos** (evento: project_view)

### **Audiencias Personalizadas:**
1. **Visitantes interesados** (vieron 3+ proyectos)
2. **Potenciales clientes** (enviaron formulario)
3. **Usuarios recurrentes** (2+ sesiones)

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **No aparecen datos:**
- ✅ Verifica que el ID sea correcto (`G-XXXXXXXXXX`)
- ✅ Espera 24-48 horas para datos completos
- ✅ Revisa que la variable de entorno esté configurada
- ✅ Verifica en "Tiempo real" primero

### **Eventos no se registran:**
- ✅ Abre la consola del navegador
- ✅ Busca errores de JavaScript
- ✅ Verifica que las funciones `gtag` estén disponibles

### **Datos incorrectos:**
- ✅ Revisa filtros en Google Analytics
- ✅ Verifica la zona horaria
- ✅ Comprueba que no haya código duplicado

---

## 📞 **PRÓXIMOS PASOS**

1. **Configurar alertas** para caídas de tráfico
2. **Crear informes personalizados** para MG Arquitectura
3. **Integrar con Google Search Console**
4. **Configurar Google Ads** (si planeas hacer publicidad)
5. **Crear dashboards** en Google Data Studio

---

## 🎉 **¡LISTO!**

Tu sitio web ahora tiene **Google Analytics 4** completamente configurado y funcionando. Podrás ver:

- 📊 **Visitantes en tiempo real**
- 📈 **Tendencias de tráfico**
- 🎯 **Comportamiento de usuarios**
- 📞 **Efectividad de contactos**
- 🏗️ **Proyectos más populares**

**¡Ahora puedes tomar decisiones basadas en datos reales!** 🚀

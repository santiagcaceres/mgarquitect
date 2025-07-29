const fs = require("fs")
const { execSync } = require("child_process")

console.log("🚀 Configurando proyecto MG Arquitectura...")

try {
  // Verificar Node.js version
  const nodeVersion = process.version
  console.log(`📋 Node.js version: ${nodeVersion}`)

  // Limpiar instalaciones previas
  console.log("🧹 Limpiando instalaciones previas...")
  if (fs.existsSync("node_modules")) {
    execSync("rm -rf node_modules", { stdio: "inherit" })
  }
  if (fs.existsSync("package-lock.json")) {
    execSync("rm -f package-lock.json", { stdio: "inherit" })
  }

  // Instalar dependencias
  console.log("📦 Instalando dependencias...")
  execSync("npm install", { stdio: "inherit" })

  // Verificar instalación
  console.log("✅ Verificando instalación...")
  execSync("npm run type-check", { stdio: "inherit" })

  console.log("🎉 ¡Proyecto configurado exitosamente!")
  console.log("")
  console.log("📋 Próximos pasos:")
  console.log("1. Configura las variables de entorno en Vercel")
  console.log("2. Ejecuta el script de Supabase")
  console.log("3. Haz push a GitHub")
  console.log("")
  console.log("🚀 Para desarrollo local: npm run dev")
} catch (error) {
  console.error("❌ Error durante la configuración:", error.message)
  process.exit(1)
}

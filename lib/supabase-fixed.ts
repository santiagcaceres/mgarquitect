import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno de Supabase")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  area: string
  images: string[]
  cover_image: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export interface HeroProject {
  id: string
  title: string
  description: string
  image: string
  order: number
}

export interface HeroSettings {
  id: string
  main_title: string
  subtitle: string
  updated_at: string
}

// Función helper para manejar errores
function handleError(error: any, operation: string) {
  console.error(`Error en ${operation}:`, error)

  if (error.code === "PGRST301") {
    throw new Error(`No se encontraron datos para ${operation}`)
  }

  if (error.code === "23505") {
    throw new Error(`Ya existe un registro duplicado en ${operation}`)
  }

  if (error.code === "23503") {
    throw new Error(`Error de referencia en ${operation}`)
  }

  if (error.code === "42501") {
    throw new Error(`Sin permisos para ${operation}. Verifica la configuración RLS en Supabase`)
  }

  if (error.message?.includes("JWT")) {
    throw new Error(`Error de autenticación en ${operation}. Verifica las credenciales de Supabase`)
  }

  if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
    throw new Error(`La tabla no existe para ${operation}. Ejecuta el script de creación de tablas`)
  }

  throw new Error(`Error en ${operation}: ${error.message || "Error desconocido"}`)
}

// Funciones helper para proyectos
export const projectsService = {
  // Obtener todos los proyectos publicados
  async getPublishedProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })

      if (error) {
        handleError(error, "obtener proyectos publicados")
      }

      return data || []
    } catch (error) {
      console.error("Error en getPublishedProjects:", error)
      return []
    }
  },

  // Obtener todos los proyectos (admin)
  async getAllProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        handleError(error, "obtener todos los proyectos")
      }

      return data || []
    } catch (error) {
      console.error("Error en getAllProjects:", error)
      return []
    }
  },

  // Obtener proyecto por ID
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

      if (error) {
        handleError(error, `obtener proyecto con ID ${id}`)
      }

      return data
    } catch (error) {
      console.error("Error en getProjectById:", error)
      return null
    }
  },

  // Crear nuevo proyecto
  async createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project | null> {
    try {
      console.log("Creando proyecto:", project)

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            ...project,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error detallado al crear proyecto:", error)
        handleError(error, "crear proyecto")
      }

      console.log("Proyecto creado exitosamente:", data)
      return data
    } catch (error) {
      console.error("Error en createProject:", error)
      throw error
    }
  },

  // Actualizar proyecto
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      console.log("Actualizando proyecto:", id, updates)

      const { data, error } = await supabase
        .from("projects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error detallado al actualizar proyecto:", error)
        handleError(error, "actualizar proyecto")
      }

      console.log("Proyecto actualizado exitosamente:", data)
      return data
    } catch (error) {
      console.error("Error en updateProject:", error)
      throw error
    }
  },

  // Eliminar proyecto
  async deleteProject(id: string): Promise<boolean> {
    try {
      console.log("Eliminando proyecto:", id)

      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) {
        console.error("Error detallado al eliminar proyecto:", error)
        handleError(error, "eliminar proyecto")
      }

      console.log("Proyecto eliminado exitosamente")
      return true
    } catch (error) {
      console.error("Error en deleteProject:", error)
      throw error
    }
  },

  // Cambiar estado del proyecto
  async toggleProjectStatus(id: string): Promise<Project | null> {
    try {
      // Primero obtener el proyecto actual
      const project = await this.getProjectById(id)
      if (!project) {
        throw new Error("Proyecto no encontrado")
      }

      const newStatus = project.status === "published" ? "draft" : "published"
      return await this.updateProject(id, { status: newStatus })
    } catch (error) {
      console.error("Error en toggleProjectStatus:", error)
      throw error
    }
  },
}

// Funciones helper para el hero/banner
export const heroService = {
  // Obtener configuración del hero
  async getHeroSettings(): Promise<HeroSettings | null> {
    try {
      const { data, error } = await supabase.from("hero_settings").select("*").single()

      if (error) {
        handleError(error, "obtener configuración del hero")
      }

      return data
    } catch (error) {
      console.error("Error en getHeroSettings:", error)
      return null
    }
  },

  // Obtener proyectos del hero
  async getHeroProjects(): Promise<HeroProject[]> {
    try {
      const { data, error } = await supabase.from("hero_projects").select("*").order("order", { ascending: true })

      if (error) {
        handleError(error, "obtener proyectos del hero")
      }

      return data || []
    } catch (error) {
      console.error("Error en getHeroProjects:", error)
      return []
    }
  },

  // Actualizar configuración del hero
  async updateHeroSettings(settings: Omit<HeroSettings, "id" | "updated_at">): Promise<HeroSettings | null> {
    try {
      console.log("Actualizando configuración del hero:", settings)

      const { data, error } = await supabase
        .from("hero_settings")
        .upsert([
          {
            id: "1", // ID fijo para configuración única
            ...settings,
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error detallado al actualizar hero settings:", error)
        handleError(error, "actualizar configuración del hero")
      }

      console.log("Configuración del hero actualizada exitosamente:", data)
      return data
    } catch (error) {
      console.error("Error en updateHeroSettings:", error)
      throw error
    }
  },

  // Actualizar proyectos del hero
  async updateHeroProjects(projects: Omit<HeroProject, "id">[]): Promise<boolean> {
    try {
      console.log("Actualizando proyectos del hero:", projects)

      // Eliminar proyectos existentes
      const { error: deleteError } = await supabase
        .from("hero_projects")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000") // Eliminar todos

      if (deleteError) {
        console.error("Error al eliminar proyectos del hero:", deleteError)
        handleError(deleteError, "eliminar proyectos del hero existentes")
      }

      // Insertar nuevos proyectos
      const { error: insertError } = await supabase.from("hero_projects").insert(
        projects.map((project, index) => ({
          ...project,
          order: index + 1,
        })),
      )

      if (insertError) {
        console.error("Error al insertar proyectos del hero:", insertError)
        handleError(insertError, "insertar nuevos proyectos del hero")
      }

      console.log("Proyectos del hero actualizados exitosamente")
      return true
    } catch (error) {
      console.error("Error en updateHeroProjects:", error)
      throw error
    }
  },
}

// Función para subir imágenes
export const storageService = {
  // Subir imagen
  async uploadImage(file: File, bucket = "images"): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      console.log("Subiendo imagen:", fileName)

      const { error } = await supabase.storage.from(bucket).upload(filePath, file)

      if (error) {
        console.error("Error detallado al subir imagen:", error)
        handleError(error, "subir imagen")
      }

      // Obtener URL pública
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

      console.log("Imagen subida exitosamente:", data.publicUrl)
      return data.publicUrl
    } catch (error) {
      console.error("Error en uploadImage:", error)
      return null
    }
  },

  // Eliminar imagen
  async deleteImage(url: string, bucket = "images"): Promise<boolean> {
    try {
      // Extraer el nombre del archivo de la URL
      const fileName = url.split("/").pop()
      if (!fileName) {
        throw new Error("No se pudo extraer el nombre del archivo de la URL")
      }

      console.log("Eliminando imagen:", fileName)

      const { error } = await supabase.storage.from(bucket).remove([fileName])

      if (error) {
        console.error("Error detallado al eliminar imagen:", error)
        handleError(error, "eliminar imagen")
      }

      console.log("Imagen eliminada exitosamente")
      return true
    } catch (error) {
      console.error("Error en deleteImage:", error)
      return false
    }
  },
}

// Función para probar la conexión
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from("projects").select("count", { count: "exact", head: true })

    if (error) {
      return {
        success: false,
        message: `Error de conexión: ${error.message}`,
      }
    }

    return {
      success: true,
      message: "Conexión exitosa con Supabase",
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Error de conexión: ${error.message}`,
    }
  }
}

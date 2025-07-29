import { createClient } from "@supabase/supabase-js"

// Variables de entorno requeridas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno de Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY",
  )
}

// Cliente para el lado del cliente (navegador)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para el lado del servidor (Server Actions) con permisos de admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Tipos para la base de datos
export interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  area: string
  is_featured: boolean
  status: "draft" | "published"
  created_at: string
  updated_at: string
  project_images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  is_cover: boolean
  order: number
}

export interface HeroSlide {
  id: string
  title: string
  description: string
  image_url: string
  order: number
  created_at: string
}

// Funciones helper para proyectos
export const projectsService = {
  // Obtener todos los proyectos publicados
  async getPublishedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_images (
          id,
          image_url,
          is_cover,
          "order"
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error obteniendo proyectos publicados:", error)
      throw new Error(`Error al obtener proyectos: ${error.message}`)
    }

    return data || []
  },

  // Obtener todos los proyectos (admin)
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select(`
        *,
        project_images (
          id,
          image_url,
          is_cover,
          "order"
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error obteniendo todos los proyectos:", error)
      throw new Error(`Error al obtener proyectos: ${error.message}`)
    }

    return data || []
  },

  // Obtener proyecto por ID
  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_images (
          id,
          image_url,
          is_cover,
          "order"
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error obteniendo proyecto por ID:", error)
      return null
    }

    return data
  },

  // Crear nuevo proyecto
  async createProject(projectData: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([
        {
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creando proyecto:", error)
      throw new Error(`Error al crear proyecto: ${error.message}`)
    }

    return data
  },

  // Actualizar proyecto
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error actualizando proyecto:", error)
      throw new Error(`Error al actualizar proyecto: ${error.message}`)
    }

    return data
  },

  // Eliminar proyecto
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error eliminando proyecto:", error)
      throw new Error(`Error al eliminar proyecto: ${error.message}`)
    }
  },
}

// Funciones helper para el hero/banner
export const heroService = {
  // Obtener slides del hero
  async getHeroSlides(): Promise<HeroSlide[]> {
    const { data, error } = await supabase.from("hero_slides").select("*").order("order", { ascending: true })

    if (error) {
      console.error("Error obteniendo slides del hero:", error)
      throw new Error(`Error al obtener slides: ${error.message}`)
    }

    return data || []
  },

  // Actualizar slides del hero
  async updateHeroSlides(slides: Omit<HeroSlide, "id" | "created_at">[]): Promise<void> {
    // Eliminar slides existentes
    const { error: deleteError } = await supabaseAdmin
      .from("hero_slides")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      console.error("Error eliminando slides existentes:", deleteError)
      throw new Error(`Error al eliminar slides: ${deleteError.message}`)
    }

    // Insertar nuevos slides
    const { error: insertError } = await supabaseAdmin.from("hero_slides").insert(
      slides.map((slide, index) => ({
        ...slide,
        order: index + 1,
        created_at: new Date().toISOString(),
      })),
    )

    if (insertError) {
      console.error("Error insertando nuevos slides:", insertError)
      throw new Error(`Error al insertar slides: ${insertError.message}`)
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

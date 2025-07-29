import { createClient } from "@supabase/supabase-js"

// Verificar si las variables de entorno están configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
const isAdminConfigured = !!(supabaseUrl && supabaseServiceRoleKey)

// Debug: mostrar estado de configuración
console.log("🔍 Supabase Configuration Status:")
console.log("- URL configured:", !!supabaseUrl)
console.log("- Anon key configured:", !!supabaseAnonKey)
console.log("- Service role configured:", !!supabaseServiceRoleKey)
console.log("- Client ready:", isSupabaseConfigured)
console.log("- Admin ready:", isAdminConfigured)

// Crear clientes de Supabase
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

export const supabaseAdmin = isAdminConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null

// Tipos de la base de datos
export interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  area: string
  created_at: string
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
}

// Servicios de datos - SOLO SUPABASE, SIN DATOS DEMO
export const projectsService = {
  async getPublishedProjects(): Promise<Project[]> {
    if (!supabase) {
      console.log("❌ Supabase no configurado")
      return []
    }

    try {
      console.log("🔍 Obteniendo proyectos públicos...")
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_images(*)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching published projects:", error)
        return []
      }

      console.log("✅ Proyectos públicos cargados:", data?.length || 0)
      return data || []
    } catch (error) {
      console.error("❌ Exception in getPublishedProjects:", error)
      return []
    }
  },

  async getAllProjects(): Promise<Project[]> {
    if (!supabaseAdmin) {
      console.log("❌ Supabase Admin no configurado")
      return []
    }

    try {
      console.log("🔍 Obteniendo todos los proyectos (admin)...")
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select(`
          *,
          project_images(*)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching all projects:", error)
        return []
      }

      console.log("✅ Todos los proyectos cargados (admin):", data?.length || 0)
      return data || []
    } catch (error) {
      console.error("❌ Exception in getAllProjects:", error)
      return []
    }
  },

  async getProjectById(id: string): Promise<Project | null> {
    if (!supabase) {
      console.log("❌ Supabase no configurado")
      return null
    }

    try {
      console.log("🔍 Obteniendo proyecto por ID:", id)
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_images(*)
        `)
        .eq("id", id)
        .single()

      if (error) {
        console.error("❌ Error fetching project by ID:", error)
        return null
      }

      console.log("✅ Proyecto cargado:", data?.title)
      return data
    } catch (error) {
      console.error("❌ Exception in getProjectById:", error)
      return null
    }
  },

  async createProject(projectData: Omit<Project, "id" | "created_at">): Promise<Project> {
    if (!supabaseAdmin) {
      throw new Error("Supabase no configurado. Verifica las variables de entorno.")
    }

    try {
      console.log("🆕 Creando proyecto:", projectData.title)
      const { data, error } = await supabaseAdmin
        .from("projects")
        .insert([
          {
            title: projectData.title,
            description: projectData.description,
            category: projectData.category,
            year: projectData.year,
            location: projectData.location,
            area: projectData.area,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("❌ Error creating project:", error)
        throw error
      }

      console.log("✅ Proyecto creado en Supabase:", data.title)
      return data
    } catch (error) {
      console.error("❌ Exception in createProject:", error)
      throw error
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (!supabaseAdmin) {
      throw new Error("Supabase no configurado. Verifica las variables de entorno.")
    }

    try {
      console.log("🔄 Actualizando proyecto:", id)
      const { data, error } = await supabaseAdmin
        .from("projects")
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          year: updates.year,
          location: updates.location,
          area: updates.area,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("❌ Error updating project:", error)
        throw error
      }

      console.log("✅ Proyecto actualizado en Supabase:", data.title)
      return data
    } catch (error) {
      console.error("❌ Exception in updateProject:", error)
      throw error
    }
  },

  async deleteProject(id: string): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error("Supabase no configurado. Verifica las variables de entorno.")
    }

    try {
      console.log("🗑️ Eliminando proyecto:", id)
      const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

      if (error) {
        console.error("❌ Error deleting project:", error)
        throw error
      }

      console.log("✅ Proyecto eliminado de Supabase:", id)
    } catch (error) {
      console.error("❌ Exception in deleteProject:", error)
      throw error
    }
  },
}

export const heroService = {
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (!supabase) {
      console.log("❌ Supabase no configurado")
      return []
    }

    try {
      const { data, error } = await supabase.from("hero_slides").select("*").order("order")

      if (error) {
        console.error("Error fetching hero slides:", error)
        throw error
      }

      console.log("✅ Hero slides cargados desde Supabase:", data?.length || 0)
      return data || []
    } catch (error) {
      console.error("Error fetching hero slides:", error)
      return []
    }
  },

  async updateHeroSlides(slides: Omit<HeroSlide, "id">[]): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error("Supabase no configurado. Verifica las variables de entorno.")
    }

    try {
      // Eliminar slides existentes
      await supabaseAdmin.from("hero_slides").delete().neq("id", "")

      // Insertar nuevos slides
      const { error } = await supabaseAdmin.from("hero_slides").insert(slides)

      if (error) {
        console.error("Error updating hero slides:", error)
        throw error
      }

      console.log("✅ Hero slides actualizados en Supabase:", slides.length)
    } catch (error) {
      console.error("Error updating hero slides:", error)
      throw error
    }
  },
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  if (!supabase || !supabaseAdmin) {
    return {
      success: false,
      message: "❌ Supabase no configurado - Configura las variables de entorno en Vercel",
    }
  }

  try {
    const { data, error } = await supabase.from("projects").select("id").limit(1)
    if (error) throw error

    return {
      success: true,
      message: "✅ Conectado a Supabase correctamente",
    }
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Error de conexión: ${error.message}`,
    }
  }
}

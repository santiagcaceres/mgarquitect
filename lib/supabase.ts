import { createClient } from "@supabase/supabase-js"

// Variables de entorno (opcionales para desarrollo)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Verificar si Supabase está configurado
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Cliente para el lado del cliente (navegador) - con fallback para desarrollo
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient("https://demo.supabase.co", "demo-key") // Cliente dummy para desarrollo

// Cliente para el lado del servidor (Server Actions) con permisos de admin
export const supabaseAdmin =
  isSupabaseConfigured && supabaseServiceRoleKey
    ? createClient(supabaseUrl!, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : createClient("https://demo.supabase.co", "demo-service-key") // Cliente dummy para desarrollo

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

// Datos de ejemplo para modo demo
const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    title: "Casa Moderna en el Bosque",
    description:
      "Un refugio contemporáneo que se fusiona con la naturaleza, utilizando materiales locales y un diseño sostenible que respeta el entorno natural.",
    category: "Residencial",
    year: "2024",
    location: "Punta del Este, Uruguay",
    area: "220 m²",
    is_featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project_images: [
      {
        id: "img-1",
        project_id: "demo-1",
        image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        is_cover: true,
        order: 0,
      },
      {
        id: "img-2",
        project_id: "demo-1",
        image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
        is_cover: false,
        order: 1,
      },
    ],
  },
  {
    id: "demo-2",
    title: "Oficinas Corporativas Minimalistas",
    description:
      "Espacio de trabajo moderno y funcional que promueve la colaboración y la productividad en un ambiente inspirador.",
    category: "Comercial",
    year: "2024",
    location: "Montevideo, Uruguay",
    area: "320 m²",
    is_featured: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project_images: [
      {
        id: "img-3",
        project_id: "demo-2",
        image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop",
        is_cover: true,
        order: 0,
      },
    ],
  },
  {
    id: "demo-3",
    title: "Loft Industrial Renovado",
    description:
      "Transformación de un espacio industrial en un moderno loft residencial, conservando elementos arquitectónicos originales.",
    category: "Residencial",
    year: "2023",
    location: "Montevideo, Uruguay",
    area: "180 m²",
    is_featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project_images: [
      {
        id: "img-4",
        project_id: "demo-3",
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
        is_cover: true,
        order: 0,
      },
    ],
  },
]

const DEMO_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Diseño de Interiores",
    description: "Espacios funcionales y estéticamente atractivos",
    image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-2",
    title: "Arquitectura Residencial",
    description: "Viviendas modernas que inspiran",
    image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
    order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "slide-3",
    title: "Proyectos Comerciales",
    description: "Diseño innovador para tu negocio",
    image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop",
    order: 3,
    created_at: new Date().toISOString(),
  },
]

// Funciones helper para proyectos
export const projectsService = {
  // Obtener todos los proyectos publicados
  async getPublishedProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: usando datos de ejemplo")
      return DEMO_PROJECTS.filter((p) => p.status === "published")
    }

    try {
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
        return DEMO_PROJECTS.filter((p) => p.status === "published")
      }

      return data || []
    } catch (error) {
      console.error("Error en getPublishedProjects:", error)
      return DEMO_PROJECTS.filter((p) => p.status === "published")
    }
  },

  // Obtener todos los proyectos (admin)
  async getAllProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: usando datos de ejemplo")
      return DEMO_PROJECTS
    }

    try {
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
        return DEMO_PROJECTS
      }

      return data || []
    } catch (error) {
      console.error("Error en getAllProjects:", error)
      return DEMO_PROJECTS
    }
  },

  // Obtener proyecto por ID
  async getProjectById(id: string): Promise<Project | null> {
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: usando datos de ejemplo")
      return DEMO_PROJECTS.find((p) => p.id === id) || null
    }

    try {
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
        return DEMO_PROJECTS.find((p) => p.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error en getProjectById:", error)
      return DEMO_PROJECTS.find((p) => p.id === id) || null
    }
  },

  // Crear nuevo proyecto
  async createProject(projectData: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: simulando creación de proyecto")
      const newProject: Project = {
        ...projectData,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return newProject
    }

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
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: simulando actualización de proyecto")
      const existingProject = DEMO_PROJECTS.find((p) => p.id === id)
      if (!existingProject) {
        throw new Error("Proyecto no encontrado")
      }
      return {
        ...existingProject,
        ...updates,
        updated_at: new Date().toISOString(),
      }
    }

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
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: simulando eliminación de proyecto")
      return
    }

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
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: usando slides de ejemplo")
      return DEMO_HERO_SLIDES
    }

    try {
      const { data, error } = await supabase.from("hero_slides").select("*").order("order", { ascending: true })

      if (error) {
        console.error("Error obteniendo slides del hero:", error)
        return DEMO_HERO_SLIDES
      }

      return data || DEMO_HERO_SLIDES
    } catch (error) {
      console.error("Error en getHeroSlides:", error)
      return DEMO_HERO_SLIDES
    }
  },

  // Actualizar slides del hero
  async updateHeroSlides(slides: Omit<HeroSlide, "id" | "created_at">[]): Promise<void> {
    if (!isSupabaseConfigured) {
      console.log("🔄 Modo demo: simulando actualización de slides")
      return
    }

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
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: "Modo demo: Supabase no configurado. Configura las variables de entorno para usar la base de datos.",
    }
  }

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

// Exportar estado de configuración para uso en componentes
export { isSupabaseConfigured }

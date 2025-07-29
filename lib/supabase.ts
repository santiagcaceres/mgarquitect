import { createClient } from "@supabase/supabase-js"

// Verificar si las variables de entorno están configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
const isAdminConfigured = !!(supabaseUrl && supabaseServiceRoleKey)

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
    created_at: new Date().toISOString(),
    project_images: [
      {
        id: "img-1",
        project_id: "demo-1",
        image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        is_cover: true,
        order: 0,
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
    created_at: new Date().toISOString(),
    project_images: [
      {
        id: "img-2",
        project_id: "demo-2",
        image_url: "https://images.unsplash.com/photo-1556761175525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
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
  },
  {
    id: "slide-2",
    title: "Arquitectura Residencial",
    description: "Viviendas modernas que inspiran",
    image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
    order: 2,
  },
]

// Servicios de datos
export const projectsService = {
  async getPublishedProjects(): Promise<Project[]> {
    if (!supabase) {
      console.log("🔄 Modo demo: usando datos de ejemplo")
      return DEMO_PROJECTS
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`*, project_images(*)`)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching published projects:", error)
      return DEMO_PROJECTS
    }
  },

  async getAllProjects(): Promise<Project[]> {
    if (!supabaseAdmin) {
      console.log("🔄 Modo demo: usando datos de ejemplo")
      return DEMO_PROJECTS
    }

    try {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select(`*, project_images(*)`)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching all projects:", error)
      return DEMO_PROJECTS
    }
  },

  async getProjectById(id: string): Promise<Project | null> {
    if (!supabase) {
      console.log("🔄 Modo demo: usando datos de ejemplo")
      return DEMO_PROJECTS.find((p) => p.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("projects").select(`*, project_images(*)`).eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching project by ID:", error)
      return DEMO_PROJECTS.find((p) => p.id === id) || null
    }
  },

  async createProject(projectData: Omit<Project, "id" | "created_at">): Promise<Project> {
    if (!supabaseAdmin) {
      console.log("🔄 Modo demo: simulando creación de proyecto")
      const newProject: Project = {
        ...projectData,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
      }
      return newProject
    }

    try {
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

      if (error) throw error

      // Si hay imagen de portada, agregarla
      if (projectData.project_images && projectData.project_images.length > 0) {
        const coverImage = projectData.project_images[0]
        await supabaseAdmin.from("project_images").insert([
          {
            project_id: data.id,
            image_url: coverImage.image_url,
            is_cover: true,
            order: 0,
          },
        ])
      }

      return data
    } catch (error) {
      console.error("Error creating project:", error)
      throw error
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (!supabaseAdmin) {
      console.log("🔄 Modo demo: simulando actualización de proyecto")
      const existingProject = DEMO_PROJECTS.find((p) => p.id === id)
      if (!existingProject) {
        throw new Error("Proyecto no encontrado")
      }
      return { ...existingProject, ...updates }
    }

    try {
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

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  },

  async deleteProject(id: string): Promise<void> {
    if (!supabaseAdmin) {
      console.log("🔄 Modo demo: simulando eliminación de proyecto")
      return
    }

    try {
      const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  },
}

export const heroService = {
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (!supabase) {
      console.log("🔄 Modo demo: usando slides de ejemplo")
      return DEMO_HERO_SLIDES
    }

    try {
      const { data, error } = await supabase.from("hero_slides").select("*").order("order")

      if (error) throw error
      return data || DEMO_HERO_SLIDES
    } catch (error) {
      console.error("Error fetching hero slides:", error)
      return DEMO_HERO_SLIDES
    }
  },

  async updateHeroSlides(slides: Omit<HeroSlide, "id">[]): Promise<void> {
    if (!supabaseAdmin) {
      console.log("🔄 Modo demo: simulando actualización de slides")
      return
    }

    try {
      // Eliminar slides existentes
      await supabaseAdmin.from("hero_slides").delete().neq("id", "")

      // Insertar nuevos slides
      const { error } = await supabaseAdmin.from("hero_slides").insert(slides)

      if (error) throw error
    } catch (error) {
      console.error("Error updating hero slides:", error)
      throw error
    }
  },
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return {
      success: false,
      message: "🔄 Modo demo activo - Configura las variables de entorno para conectar con Supabase",
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

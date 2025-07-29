"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(3, "El título es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  year: z.string().length(4, "El año debe tener 4 dígitos"),
  location: z.string().min(3, "La ubicación es requerida"),
  area: z.string().min(1, "El área es requerida"),
  description: z.string().min(10, "La descripción es requerida"),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean(),
})

export async function createProject(formData: FormData) {
  // En modo demo, simular la creación
  if (!isSupabaseConfigured) {
    console.log("🔄 Modo demo: simulando creación de proyecto")
    return {
      success: true,
      project: {
        id: `demo-${Date.now()}`,
        title: formData.get("title") as string,
      },
    }
  }

  const rawData = {
    title: formData.get("title"),
    category: formData.get("category"),
    year: formData.get("year"),
    location: formData.get("location"),
    area: formData.get("area"),
    description: formData.get("description"),
    status: formData.get("status"),
    is_featured: formData.get("is_featured") === "on",
  }

  const validatedFields = projectSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const { data: projectData, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert([validatedFields.data])
      .select()
      .single()

    if (projectError) {
      return { error: `Error al crear proyecto: ${projectError.message}` }
    }

    revalidatePath("/admin/proyectos")
    revalidatePath("/proyectos")
    revalidatePath("/")
    return { success: true, project: projectData }
  } catch (error: any) {
    return { error: `Error al crear proyecto: ${error.message}` }
  }
}

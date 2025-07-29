"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(3, "El título es requerido"),
  category: z.string().min(3, "La categoría es requerida"),
  year: z.string().length(4, "El año debe tener 4 dígitos"),
  location: z.string().min(3, "La ubicación es requerida"),
  area: z.string().min(1, "El área es requerida"),
  description: z.string().min(10, "La descripción es requerida"),
})

async function uploadImage(file: File, projectId: string): Promise<string> {
  const filePath = `${projectId}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabaseAdmin.storage.from("project-images").upload(filePath, file)

  if (uploadError) {
    throw new Error(`Error al subir imagen: ${uploadError.message}`)
  }

  const { data } = supabaseAdmin.storage.from("project-images").getPublicUrl(filePath)
  return data.publicUrl
}

export async function createOrUpdateProject(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())
  const validatedFields = projectSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: "Datos del formulario inválidos." }
  }

  const projectId = formData.get("id") as string | null
  const coverFile = formData.get("coverImage") as File | null
  const otherFiles = formData.getAll("otherImages") as File[]
  const existingImages = JSON.parse((formData.get("existingImages") as string) || "[]")

  try {
    let currentProjectId = projectId

    // 1. Crear o actualizar el proyecto
    if (currentProjectId) {
      // Actualizar
      const { error } = await supabaseAdmin.from("projects").update(validatedFields.data).eq("id", currentProjectId)
      if (error) throw error
    } else {
      // Crear
      const { data, error } = await supabaseAdmin.from("projects").insert(validatedFields.data).select("id").single()
      if (error) throw error
      currentProjectId = data.id
    }

    if (!currentProjectId) {
      throw new Error("No se pudo obtener el ID del proyecto.")
    }

    // 2. Manejar imágenes
    const imagesToInsert = []

    // Subir nueva imagen de portada
    if (coverFile && coverFile.size > 0) {
      const coverUrl = await uploadImage(coverFile, currentProjectId)
      // Eliminar portada anterior si existe
      await supabaseAdmin.from("project_images").delete().eq("project_id", currentProjectId).eq("is_cover", true)
      imagesToInsert.push({ project_id: currentProjectId, image_url: coverUrl, is_cover: true, order: 0 })
    }

    // Subir otras imágenes
    for (const file of otherFiles) {
      if (file.size > 0) {
        const imageUrl = await uploadImage(file, currentProjectId)
        imagesToInsert.push({ project_id: currentProjectId, image_url: imageUrl, is_cover: false, order: 1 })
      }
    }

    // 3. Eliminar imágenes que el usuario quitó
    const existingImageIds = existingImages.map((img: any) => img.id)
    const { data: currentImages } = await supabaseAdmin
      .from("project_images")
      .select("id")
      .eq("project_id", currentProjectId)
    if (currentImages) {
      const imagesToDelete = currentImages.filter((img) => !existingImageIds.includes(img.id))
      if (imagesToDelete.length > 0) {
        await supabaseAdmin
          .from("project_images")
          .delete()
          .in(
            "id",
            imagesToDelete.map((img) => img.id),
          )
      }
    }

    // Insertar nuevas imágenes en la base de datos
    if (imagesToInsert.length > 0) {
      const { error: imageError } = await supabaseAdmin.from("project_images").insert(imagesToInsert)
      if (imageError) throw imageError
    }

    revalidatePath("/admin/proyectos")
    revalidatePath("/proyectos")
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

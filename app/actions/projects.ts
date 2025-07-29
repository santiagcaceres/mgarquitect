"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase"

// Función para subir imagen a Supabase Storage
async function uploadImage(file: File, projectId: string): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error("Supabase no configurado")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabaseAdmin.storage.from("project-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Error al subir imagen: ${error.message}`)
  }

  const { data: urlData } = supabaseAdmin.storage.from("project-images").getPublicUrl(fileName)

  return urlData.publicUrl
}

// Crear o actualizar proyecto
export async function createOrUpdateProject(formData: FormData) {
  if (!supabaseAdmin) {
    return { error: "Supabase no configurado. Usando modo demo." }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const year = formData.get("year") as string
    const location = formData.get("location") as string
    const area = formData.get("area") as string
    const projectId = formData.get("id") as string | null

    // Validaciones
    if (!title?.trim()) return { error: "El título es requerido" }
    if (!description?.trim()) return { error: "La descripción es requerida" }
    if (!category?.trim()) return { error: "La categoría es requerida" }

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      year: year || new Date().getFullYear().toString(),
      location: location?.trim() || "Uruguay",
      area: area?.trim() || "N/A",
    }

    let currentProjectId = projectId

    // Crear o actualizar proyecto
    if (currentProjectId) {
      // Actualizar proyecto existente
      const { error } = await supabaseAdmin.from("projects").update(projectData).eq("id", currentProjectId)

      if (error) throw new Error(`Error al actualizar proyecto: ${error.message}`)
    } else {
      // Crear nuevo proyecto
      const { data, error } = await supabaseAdmin.from("projects").insert([projectData]).select("id").single()

      if (error) throw new Error(`Error al crear proyecto: ${error.message}`)
      currentProjectId = data.id
    }

    // Manejar imagen de portada
    const coverImage = formData.get("coverImage") as File
    if (coverImage && coverImage.size > 0) {
      // Eliminar imagen de portada anterior si existe
      if (projectId) {
        await supabaseAdmin.from("project_images").delete().eq("project_id", currentProjectId).eq("is_cover", true)
      }

      // Subir nueva imagen de portada
      const imageUrl = await uploadImage(coverImage, currentProjectId)

      const { error: imageError } = await supabaseAdmin.from("project_images").insert([
        {
          project_id: currentProjectId,
          image_url: imageUrl,
          is_cover: true,
          order: 0,
          file_name: coverImage.name,
          file_size: coverImage.size,
        },
      ])

      if (imageError) throw new Error(`Error al guardar imagen: ${imageError.message}`)
    }

    // Manejar imágenes adicionales
    const otherImages = formData.getAll("otherImages") as File[]
    for (const file of otherImages) {
      if (file && file.size > 0) {
        const imageUrl = await uploadImage(file, currentProjectId)

        const { error: imageError } = await supabaseAdmin.from("project_images").insert([
          {
            project_id: currentProjectId,
            image_url: imageUrl,
            is_cover: false,
            order: 1,
            file_name: file.name,
            file_size: file.size,
          },
        ])

        if (imageError) throw new Error(`Error al guardar imagen adicional: ${imageError.message}`)
      }
    }

    // Revalidar páginas
    revalidatePath("/admin/proyectos")
    revalidatePath("/proyectos")
    revalidatePath("/")

    return { success: true, projectId: currentProjectId }
  } catch (error: any) {
    console.error("Error in createOrUpdateProject:", error)
    return { error: error.message || "Error desconocido" }
  }
}

// Eliminar proyecto
export async function deleteProject(projectId: string) {
  if (!supabaseAdmin) {
    return { error: "Supabase no configurado" }
  }

  try {
    // Obtener imágenes para eliminar del storage
    const { data: images } = await supabaseAdmin.from("project_images").select("image_url").eq("project_id", projectId)

    // Eliminar proyecto (las imágenes se eliminan automáticamente por CASCADE)
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", projectId)

    if (error) throw new Error(`Error al eliminar proyecto: ${error.message}`)

    // Eliminar archivos del storage
    if (images && images.length > 0) {
      for (const image of images) {
        const fileName = image.image_url.split("/").pop()
        if (fileName) {
          await supabaseAdmin.storage.from("project-images").remove([`${projectId}/${fileName}`])
        }
      }
    }

    revalidatePath("/admin/proyectos")
    revalidatePath("/proyectos")
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { error: error.message || "Error al eliminar proyecto" }
  }
}

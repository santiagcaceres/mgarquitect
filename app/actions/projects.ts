"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase"

// Función para subir imagen a Supabase Storage
async function uploadImage(file: File, projectId: string): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error("Supabase no configurado - Verifica las variables de entorno")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  console.log("📤 Subiendo imagen:", fileName)

  const { data, error } = await supabaseAdmin.storage.from("project-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("❌ Error uploading image:", error)
    throw new Error(`Error al subir imagen: ${error.message}`)
  }

  const { data: urlData } = supabaseAdmin.storage.from("project-images").getPublicUrl(fileName)
  console.log("✅ Imagen subida exitosamente:", urlData.publicUrl)

  return urlData.publicUrl
}

// Crear o actualizar proyecto
export async function createOrUpdateProject(formData: FormData) {
  console.log("🚀 Iniciando createOrUpdateProject...")

  if (!supabaseAdmin) {
    console.error("❌ Supabase Admin no configurado")
    return { error: "Supabase no configurado. Verifica las variables de entorno en Vercel." }
  }

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const year = formData.get("year") as string
    const location = formData.get("location") as string
    const area = formData.get("area") as string
    const projectId = formData.get("id") as string | null

    console.log("📋 Datos del formulario:", { title, category, year, location, area, projectId })

    // Validaciones
    if (!title?.trim()) {
      console.error("❌ Título requerido")
      return { error: "El título es requerido" }
    }
    if (!description?.trim()) {
      console.error("❌ Descripción requerida")
      return { error: "La descripción es requerida" }
    }
    if (!category?.trim()) {
      console.error("❌ Categoría requerida")
      return { error: "La categoría es requerida" }
    }

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
      console.log("🔄 Actualizando proyecto existente:", currentProjectId)
      const { error } = await supabaseAdmin.from("projects").update(projectData).eq("id", currentProjectId)

      if (error) {
        console.error("❌ Error al actualizar proyecto:", error)
        throw new Error(`Error al actualizar proyecto: ${error.message}`)
      }
      console.log("✅ Proyecto actualizado exitosamente")
    } else {
      console.log("🆕 Creando nuevo proyecto...")
      const { data, error } = await supabaseAdmin.from("projects").insert([projectData]).select("id").single()

      if (error) {
        console.error("❌ Error al crear proyecto:", error)
        throw new Error(`Error al crear proyecto: ${error.message}`)
      }
      currentProjectId = data.id
      console.log("✅ Proyecto creado exitosamente:", currentProjectId)
    }

    // Manejar imagen de portada
    const coverImage = formData.get("coverImage") as File
    if (coverImage && coverImage.size > 0) {
      console.log("📸 Procesando imagen de portada...")

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
        },
      ])

      if (imageError) {
        console.error("❌ Error al guardar imagen:", imageError)
        throw new Error(`Error al guardar imagen: ${imageError.message}`)
      }
      console.log("✅ Imagen de portada guardada")
    }

    // Manejar imágenes adicionales
    const otherImages = formData.getAll("otherImages") as File[]
    if (otherImages.length > 0) {
      console.log("📸 Procesando imágenes adicionales:", otherImages.length)

      for (let i = 0; i < otherImages.length; i++) {
        const file = otherImages[i]
        if (file && file.size > 0) {
          const imageUrl = await uploadImage(file, currentProjectId)

          const { error: imageError } = await supabaseAdmin.from("project_images").insert([
            {
              project_id: currentProjectId,
              image_url: imageUrl,
              is_cover: false,
              order: i + 1,
            },
          ])

          if (imageError) {
            console.error("❌ Error al guardar imagen adicional:", imageError)
            throw new Error(`Error al guardar imagen adicional: ${imageError.message}`)
          }
        }
      }
      console.log("✅ Imágenes adicionales guardadas")
    }

    // Revalidar páginas
    revalidatePath("/admin/proyectos")
    revalidatePath("/proyectos")
    revalidatePath("/")

    console.log("🎉 Proceso completado exitosamente")
    return { success: true, projectId: currentProjectId }
  } catch (error: any) {
    console.error("❌ Error in createOrUpdateProject:", error)
    return { error: error.message || "Error desconocido" }
  }
}

// Eliminar proyecto
export async function deleteProject(projectId: string) {
  console.log("🗑️ Iniciando eliminación de proyecto:", projectId)

  if (!supabaseAdmin) {
    console.error("❌ Supabase Admin no configurado")
    return { error: "Supabase no configurado. Verifica las variables de entorno." }
  }

  try {
    // Obtener imágenes para eliminar del storage
    const { data: images } = await supabaseAdmin.from("project_images").select("image_url").eq("project_id", projectId)

    // Eliminar proyecto (las imágenes se eliminan automáticamente por CASCADE)
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", projectId)

    if (error) {
      console.error("❌ Error al eliminar proyecto:", error)
      throw new Error(`Error al eliminar proyecto: ${error.message}`)
    }

    // Eliminar archivos del storage
    if (images && images.length > 0) {
      console.log("🗑️ Eliminando imágenes del storage:", images.length)
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

    console.log("✅ Proyecto eliminado exitosamente")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Error deleting project:", error)
    return { error: error.message || "Error al eliminar proyecto" }
  }
}

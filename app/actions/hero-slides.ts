"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase"

// Función para subir imagen de slide a Supabase Storage
async function uploadSlideImage(file: File): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error("Supabase no configurado - Verifica las variables de entorno")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `hero-slides/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  console.log("📤 Subiendo imagen de slide:", fileName)

  const { data, error } = await supabaseAdmin.storage.from("project-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("❌ Error uploading slide image:", error)
    throw new Error(`Error al subir imagen: ${error.message}`)
  }

  const { data: urlData } = supabaseAdmin.storage.from("project-images").getPublicUrl(fileName)
  console.log("✅ Imagen de slide subida exitosamente:", urlData.publicUrl)

  return urlData.publicUrl
}

// Actualizar slides del banner
export async function updateHeroSlides(formData: FormData) {
  console.log("🚀 Iniciando updateHeroSlides...")

  if (!supabaseAdmin) {
    console.error("❌ Supabase Admin no configurado")
    return { error: "Supabase no configurado. Verifica las variables de entorno en Vercel." }
  }

  try {
    // Obtener datos del formulario
    const slidesData = JSON.parse(formData.get("slidesData") as string)
    console.log("📋 Datos de slides recibidos:", slidesData.length)

    // Validar que hay al menos un slide
    if (!slidesData || slidesData.length === 0) {
      return { error: "Debe haber al menos un slide" }
    }

    // Eliminar todos los slides existentes (FORMA CORRECTA)
    console.log("🗑️ Eliminando slides existentes...")
    const { error: deleteError } = await supabaseAdmin
      .from("hero_slides")
      .delete()
      .gte("id", "00000000-0000-0000-0000-000000000000") // Eliminar todos los registros

    if (deleteError) {
      console.error("❌ Error eliminando slides:", deleteError)
      // Si falla el delete, intentamos con TRUNCATE via función
      try {
        await supabaseAdmin.rpc("truncate_hero_slides")
      } catch (truncateError) {
        console.error("❌ Error con truncate también:", truncateError)
        // Como último recurso, eliminamos uno por uno
        const { data: existingSlides } = await supabaseAdmin.from("hero_slides").select("id")
        if (existingSlides) {
          for (const slide of existingSlides) {
            await supabaseAdmin.from("hero_slides").delete().eq("id", slide.id)
          }
        }
      }
    }

    // Procesar cada slide
    const slidesToInsert = []

    for (let i = 0; i < slidesData.length; i++) {
      const slide = slidesData[i]
      let imageUrl = slide.image_url

      // Si hay una imagen nueva para este slide
      const imageFile = formData.get(`image_${i}`) as File
      if (imageFile && imageFile.size > 0) {
        console.log(`📸 Procesando imagen para slide ${i + 1}...`)
        imageUrl = await uploadSlideImage(imageFile)
      }

      // Validar que el slide tenga datos mínimos
      if (slide.title.trim() && slide.description.trim()) {
        slidesToInsert.push({
          title: slide.title.trim(),
          description: slide.description.trim(),
          image_url: imageUrl || "/images/diseno-interiores.jpg", // Imagen por defecto
          order: i + 1,
        })
      }
    }

    if (slidesToInsert.length === 0) {
      return { error: "Debe haber al menos un slide con título y descripción" }
    }

    // Insertar nuevos slides
    console.log("💾 Insertando nuevos slides:", slidesToInsert.length)
    const { error: insertError } = await supabaseAdmin.from("hero_slides").insert(slidesToInsert)

    if (insertError) {
      console.error("❌ Error insertando slides:", insertError)
      throw new Error(`Error al guardar slides: ${insertError.message}`)
    }

    // Revalidar páginas
    revalidatePath("/admin/configuraciones")
    revalidatePath("/")

    console.log("🎉 Slides actualizados exitosamente")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Error in updateHeroSlides:", error)
    return { error: error.message || "Error desconocido" }
  }
}

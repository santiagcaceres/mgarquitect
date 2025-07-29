"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, X, Upload, Info } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { heroService } from "@/lib/supabase"
import { updateHeroSlides } from "@/app/actions/hero-slides"

interface HeroSlideForm {
  title: string
  description: string
  image_url: string
  order: number
  newImage?: File | null
  imagePreview?: string
}

export default function ConfiguracionesPage() {
  const [slides, setSlides] = useState<HeroSlideForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    try {
      setIsLoading(true)
      console.log("🔄 Cargando slides del banner...")
      const data = await heroService.getHeroSlides()
      const formattedSlides = data.map((slide, index) => ({
        title: slide.title,
        description: slide.description,
        image_url: slide.image_url,
        order: index + 1,
        newImage: null,
        imagePreview: undefined,
      }))
      setSlides(formattedSlides.length > 0 ? formattedSlides : getDefaultSlides())
      console.log("✅ Slides cargados:", formattedSlides.length)
    } catch (error) {
      console.error("Error loading slides:", error)
      setSlides(getDefaultSlides())
      toast.error("Error al cargar los slides. Usando datos por defecto.")
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultSlides = (): HeroSlideForm[] => [
    {
      title: "Diseño de Interiores",
      description: "Espacios funcionales y estéticamente atractivos",
      image_url: "/images/diseno-interiores.jpg",
      order: 1,
      newImage: null,
    },
    {
      title: "Arquitectura Residencial",
      description: "Viviendas modernas que inspiran",
      image_url: "/images/arquitectura-residencial.jpg",
      order: 2,
      newImage: null,
    },
    {
      title: "Proyectos Comerciales",
      description: "Diseño innovador para tu negocio",
      image_url: "/images/arquitectura-comercial.jpg",
      order: 3,
      newImage: null,
    },
  ]

  const addSlide = () => {
    const newSlide: HeroSlideForm = {
      title: "",
      description: "",
      image_url: "",
      order: slides.length + 1,
      newImage: null,
    }
    setSlides([...slides, newSlide])
  }

  const removeSlide = (index: number) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index)
      // Reordenar los slides restantes
      const reorderedSlides = newSlides.map((slide, i) => ({ ...slide, order: i + 1 }))
      setSlides(reorderedSlides)
    } else {
      toast.error("Debe haber al menos un slide")
    }
  }

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < slides.length) {
      // Intercambiar slides
      ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]

      // Actualizar el orden
      newSlides.forEach((slide, i) => {
        slide.order = i + 1
      })

      setSlides(newSlides)
    }
  }

  const updateSlide = (index: number, field: keyof HeroSlideForm, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setSlides(newSlides)
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newSlides = [...slides]
      newSlides[index].newImage = file

      // Crear preview
      const reader = new FileReader()
      reader.onload = (event) => {
        newSlides[index].imagePreview = event.target?.result as string
        setSlides([...newSlides])
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const newSlides = [...slides]
    newSlides[index].newImage = null
    newSlides[index].imagePreview = undefined
    setSlides(newSlides)

    // Limpiar el input
    const input = document.getElementById(`image-${index}`) as HTMLInputElement
    if (input) input.value = ""
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Validar que todos los slides tengan título y descripción
      const validSlides = slides.filter((slide) => slide.title.trim() && slide.description.trim())

      if (validSlides.length === 0) {
        toast.error("Debe haber al menos un slide con título y descripción")
        return
      }

      // Crear FormData
      const formData = new FormData()

      // Agregar datos de slides
      const slidesData = validSlides.map((slide) => ({
        title: slide.title,
        description: slide.description,
        image_url: slide.image_url,
        order: slide.order,
      }))

      formData.append("slidesData", JSON.stringify(slidesData))

      // Agregar imágenes
      validSlides.forEach((slide, index) => {
        if (slide.newImage) {
          formData.append(`image_${index}`, slide.newImage)
        }
      })

      console.log("💾 Guardando slides...")
      const result = await updateHeroSlides(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Configuración del banner guardada exitosamente")
        loadSlides() // Recargar para mostrar las nuevas imágenes
      }
    } catch (error) {
      console.error("❌ Error saving slides:", error)
      toast.error("Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuraciones</h1>

      {/* Información sobre imágenes */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Información sobre Imágenes del Banner
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <p>
            <strong>Subida de archivos locales:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Formatos aceptados:</strong> JPG, PNG, WebP
            </li>
            <li>
              <strong>Tamaño máximo:</strong> 5MB por imagen
            </li>
            <li>
              <strong>Resolución recomendada:</strong> 1920x1080 píxeles (formato panorámico)
            </li>
            <li>
              <strong>Uso:</strong> Estas imágenes se mostrarán como fondo del banner principal
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner Principal</CardTitle>
          <CardDescription>
            Gestiona los slides que aparecen en el banner de la página de inicio. Puedes agregar, editar y eliminar
            slides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Slides del Banner ({slides.length})</h3>
            <Button onClick={addSlide} className="bg-black hover:bg-gray-800 text-white" disabled={isSaving}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Slide
            </Button>
          </div>

          <div className="space-y-6">
            {slides.map((slide, index) => (
              <Card key={index} className="border-2 border-dashed border-gray-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">Slide {index + 1}</h4>
                    {slides.length > 1 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSlide(index, "up")}
                          disabled={isSaving || index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSlide(index, "down")}
                          disabled={isSaving || index === slides.length - 1}
                        >
                          ↓
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => removeSlide(index)} disabled={isSaving}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Título *</Label>
                      <Input
                        id={`title-${index}`}
                        value={slide.title}
                        onChange={(e) => updateSlide(index, "title", e.target.value)}
                        placeholder="Título del slide"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Descripción *</Label>
                      <Input
                        id={`description-${index}`}
                        value={slide.description}
                        onChange={(e) => updateSlide(index, "description", e.target.value)}
                        placeholder="Descripción del slide"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Imagen del Slide</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id={`image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        disabled={isSaving}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-gray-500" />
                    </div>

                    {/* Mostrar imagen actual o preview */}
                    {(slide.imagePreview || slide.image_url) && (
                      <div className="relative inline-block mt-2">
                        <Image
                          src={slide.imagePreview || slide.image_url || "/placeholder.svg"}
                          alt={`Slide ${index + 1}`}
                          width={300}
                          height={180}
                          className="rounded object-cover border"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                          onClick={() => removeImage(index)}
                          disabled={isSaving}
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {slide.imagePreview && (
                          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Nueva imagen
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={loadSlides} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-black hover:bg-gray-800 text-white">
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

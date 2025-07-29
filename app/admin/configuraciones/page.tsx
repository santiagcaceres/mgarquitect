"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { heroService } from "@/lib/supabase-production"

interface HeroSlideForm {
  title: string
  description: string
  image_url: string
  order: number
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
      const data = await heroService.getHeroSlides()
      const formattedSlides = data.map((slide, index) => ({
        title: slide.title,
        description: slide.description,
        image_url: slide.image_url,
        order: index + 1,
      }))
      setSlides(formattedSlides.length > 0 ? formattedSlides : getDefaultSlides())
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
      image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
      order: 1,
    },
    {
      title: "Arquitectura Residencial",
      description: "Viviendas modernas que inspiran",
      image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
      order: 2,
    },
    {
      title: "Proyectos Comerciales",
      description: "Diseño innovador para tu negocio",
      image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop",
      order: 3,
    },
  ]

  const addSlide = () => {
    const newSlide: HeroSlideForm = {
      title: "",
      description: "",
      image_url: "",
      order: slides.length + 1,
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

  const updateSlide = (index: number, field: keyof HeroSlideForm, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setSlides(newSlides)
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        updateSlide(index, "image_url", imageUrl)
      }
      reader.readAsDataURL(file)
    }
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

      // Preparar datos para Supabase
      const slidesToSave = validSlides.map((slide) => ({
        title: slide.title,
        description: slide.description,
        image_url:
          slide.image_url ||
          "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
        order: slide.order,
      }))

      await heroService.updateHeroSlides(slidesToSave)
      toast.success("Configuración del banner guardada exitosamente")
    } catch (error) {
      console.error("Error saving slides:", error)
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
            <Button onClick={addSlide} className="bg-black hover:bg-gray-800 text-white">
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
                      <Button variant="destructive" size="sm" onClick={() => removeSlide(index)} disabled={isSaving}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
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
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        disabled={isSaving}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-gray-500" />
                    </div>
                    {slide.image_url && (
                      <div className="relative inline-block mt-2">
                        <Image
                          src={slide.image_url || "/placeholder.svg"}
                          alt={`Slide ${index + 1}`}
                          width={200}
                          height={120}
                          className="rounded object-cover border"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                          onClick={() => updateSlide(index, "image_url", "")}
                          disabled={isSaving}
                        >
                          <X className="h-3 w-3" />
                        </button>
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

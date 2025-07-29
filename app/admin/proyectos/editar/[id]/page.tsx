"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, X, Star, Info } from "lucide-react"
import { toast } from "sonner"
import { projectsService, type Project, type ProjectImage } from "@/lib/supabase"
import { createOrUpdateProject } from "@/app/actions/projects"
import Image from "next/image"

export default function EditarProyectoPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    year: "",
    location: "",
    area: "",
  })
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  useEffect(() => {
    async function fetchProject() {
      if (!params.id) return

      try {
        const projectData = await projectsService.getProjectById(params.id as string)
        if (projectData) {
          setProject(projectData)
          setFormData({
            title: projectData.title,
            description: projectData.description,
            category: projectData.category,
            year: projectData.year,
            location: projectData.location,
            area: projectData.area,
          })
          setExistingImages(projectData.project_images || [])
        } else {
          toast.error("Proyecto no encontrado")
          router.push("/admin/proyectos")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast.error("Error al cargar el proyecto")
        router.push("/admin/proyectos")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNewImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setNewImages((prev) => [...prev, ...files])

    // Crear previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setNewImagePreviews((prev) => [...prev, event.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
    toast.success("Imagen marcada para eliminar")
  }

  const setCoverImage = (imageId: string) => {
    setExistingImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_cover: img.id === imageId,
      })),
    )
    toast.success("Imagen de portada actualizada")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    startTransition(async () => {
      try {
        // Validaciones básicas
        if (!formData.title.trim()) {
          toast.error("El título es requerido")
          return
        }
        if (!formData.description.trim()) {
          toast.error("La descripción es requerida")
          return
        }

        // Crear FormData
        const form = new FormData()
        form.append("id", project.id)
        form.append("title", formData.title.trim())
        form.append("description", formData.description.trim())
        form.append("category", formData.category.trim())
        form.append("year", formData.year)
        form.append("location", formData.location.trim())
        form.append("area", formData.area.trim())

        // Agregar imágenes existentes (las que no se eliminaron)
        form.append("existingImages", JSON.stringify(existingImages))

        // Agregar nuevas imágenes
        newImages.forEach((file) => {
          form.append("otherImages", file)
        })

        console.log("🔄 Actualizando proyecto con imágenes...")
        const result = await createOrUpdateProject(form)

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Proyecto actualizado exitosamente")
          router.push("/admin/proyectos")
        }
      } catch (error) {
        console.error("Error updating project:", error)
        toast.error("Error al actualizar el proyecto")
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Proyecto no encontrado</h2>
        <Button onClick={() => router.push("/admin/proyectos")}>Volver a Proyectos</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/admin/proyectos")} disabled={isPending}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Proyectos
        </Button>
        <h1 className="text-3xl font-bold">Editar: {project.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título del Proyecto *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                disabled={isPending}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información sobre imágenes */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-blue-700">
                  <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Imagen de portada:</strong> Marcada con ⭐ (se muestra en la lista de proyectos)
                    </p>
                    <p>
                      <strong>Eliminar:</strong> Click en ❌ para marcar imagen para eliminar
                    </p>
                    <p>
                      <strong>Cambiar portada:</strong> Click en "Marcar como portada"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes existentes */}
            {existingImages.length > 0 && (
              <div>
                <Label className="text-lg font-semibold">Imágenes Actuales ({existingImages.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative">
                        <Image
                          src={image.image_url || "/placeholder.svg"}
                          alt="Imagen del proyecto"
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        {image.is_cover && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full">
                            <Star className="h-4 w-4" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isPending}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {!image.is_cover && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCoverImage(image.id)}
                          className="w-full mt-2 text-xs"
                          disabled={isPending}
                        >
                          Marcar como portada
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agregar nuevas imágenes */}
            <div>
              <Label htmlFor="newImages" className="text-lg font-semibold">
                Agregar Nuevas Imágenes
              </Label>
              <div className="mt-2">
                <Input
                  id="newImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesUpload}
                  disabled={isPending}
                  className="mb-4"
                />
                <p className="text-sm text-gray-500">
                  Puedes seleccionar múltiples imágenes. Formatos: JPG, PNG, WebP. Máximo 5MB por imagen.
                </p>
              </div>

              {/* Preview de nuevas imágenes */}
              {newImagePreviews.length > 0 && (
                <div className="mt-4">
                  <Label className="text-base font-medium">Nuevas Imágenes a Agregar ({newImagePreviews.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview || "/placeholder.svg"}
                          alt={`Nueva imagen ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isPending}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Nueva
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/proyectos")} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-black hover:bg-gray-800 text-white">
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}

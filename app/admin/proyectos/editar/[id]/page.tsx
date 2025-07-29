"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { projectsService, type Project } from "@/lib/supabase"

export default function EditarProyectoPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    year: "",
    location: "",
    area: "",
    coverImage: "",
  })

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
            coverImage: projectData.project_images?.find((img) => img.is_cover)?.image_url || "",
          })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setSaving(true)

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

      // Actualizar el proyecto
      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        year: formData.year,
        location: formData.location.trim(),
        area: formData.area.trim(),
      }

      await projectsService.updateProject(project.id, updatedData)
      toast.success("Proyecto actualizado exitosamente")
      router.push("/admin/proyectos")
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("Error al actualizar el proyecto")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        <Button variant="ghost" onClick={() => router.push("/admin/proyectos")} disabled={saving}>
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
                  disabled={saving}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  disabled={saving}
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
                disabled={saving}
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
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/proyectos")} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="bg-black hover:bg-gray-800 text-white">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}

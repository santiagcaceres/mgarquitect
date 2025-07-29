"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Info } from "lucide-react"
import { LoadingScreen } from "@/components/loading-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  area: string
  coverImage: string
  status: "published"
  createdAt: string
  updatedAt: string
}

export default function EditarProyectoPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    area: "",
    year: "",
    coverImage: "",
  })

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("mg-admin-authenticated")
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    const projectId = params.id as string
    const savedProjects = localStorage.getItem("mg-arquitectura-projects")

    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      const foundProject = projects.find((p: Project) => p.id === projectId)

      if (foundProject) {
        setProject(foundProject)
        setFormData({
          title: foundProject.title,
          description: foundProject.description,
          category: foundProject.category,
          location: foundProject.location,
          area: foundProject.area,
          year: foundProject.year,
          coverImage: foundProject.coverImage,
        })
      } else {
        router.push("/admin")
        return
      }
    }

    setIsLoading(false)
  }, [router, params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    if (!project) return

    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      alert("Por favor, completa todos los campos obligatorios (*)")
      setIsSaving(false)
      return
    }

    try {
      const updatedProject: Project = {
        ...project,
        ...formData,
        updatedAt: new Date().toISOString(),
      }

      const savedProjects = localStorage.getItem("mg-arquitectura-projects")
      const existingProjects = savedProjects ? JSON.parse(savedProjects) : []

      const updatedProjects = existingProjects.map((p: Project) => (p.id === project.id ? updatedProject : p))
      localStorage.setItem("mg-arquitectura-projects", JSON.stringify(updatedProjects))

      sessionStorage.setItem(
        "mg-admin-message",
        JSON.stringify({
          message: "Proyecto actualizado exitosamente",
          type: "success",
        }),
      )

      router.push("/admin")
    } catch (error) {
      alert("Error al actualizar el proyecto. Inténtalo de nuevo.")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => {}} />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Panel
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Proyecto no encontrado</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-8">El proyecto que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/admin")} className="btn-black">
            Volver al Panel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              disabled={isSaving}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Panel
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Editar: {project.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Información sobre imágenes */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Info className="h-5 w-5" />
              Información Importante sobre Imágenes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 space-y-2">
            <p>
              <strong>Tamaños recomendados:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Imagen principal:</strong> 1200x800 píxeles (proporción 3:2)
              </li>
              <li>
                <strong>Peso máximo:</strong> 2MB por imagen
              </li>
              <li>
                <strong>Formatos aceptados:</strong> JPG, PNG, WebP
              </li>
            </ul>
            <p>
              <strong>Consejos:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Usa imágenes de alta calidad y bien iluminadas</li>
              <li>Evita imágenes borrosas o pixeladas</li>
              <li>Las imágenes horizontales funcionan mejor</li>
              <li>Puedes usar servicios gratuitos de hosting de imágenes para obtener las URLs</li>
            </ul>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-gray-700 font-medium">
                  Nombre del Proyecto *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-gray-700 font-medium">
                  Categoría *
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Ubicación *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-gray-700 font-medium">
                  Área *
                </Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-gray-700 font-medium">
                  Año *
                </Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Descripción del Proyecto *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-gray-50 border-gray-300 text-gray-800 min-h-32 focus:border-black focus:ring-black"
                disabled={isSaving}
              />
            </div>

            <div>
              <Label htmlFor="coverImage" className="text-gray-700 font-medium">
                URL de la Imagen Principal *
              </Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                required
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500 mt-2">
                Pega aquí la URL de la imagen principal del proyecto. Puedes subir la imagen a cualquier servicio de
                hosting de imágenes gratuito.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
                className="px-6 py-2"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" className="btn-black px-6 py-2" disabled={isSaving}>
                {isSaving ? "Actualizando..." : "Actualizar Proyecto"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

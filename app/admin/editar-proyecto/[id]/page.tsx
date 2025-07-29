"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X } from "lucide-react"
import Image from "next/image"
import { LoadingScreen } from "@/components/loading-screen"

interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  area: string
  images: string[]
  coverImage: string
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export default function EditarProyectoPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    area: "",
    year: "",
    images: [] as string[],
    coverImage: "",
    status: "published" as "draft" | "published",
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
          images: foundProject.images,
          coverImage: foundProject.coverImage,
          status: foundProject.status,
        })
      } else {
        router.push("/admin")
        return
      }
    }

    setIsLoading(false)
  }, [router, params.id])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        if (isCover) {
          setFormData({ ...formData, coverImage: imageUrl })
        } else {
          setFormData({ ...formData, images: [...formData.images, imageUrl] })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!project) return

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("El título y la descripción son requeridos")
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
    }
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => {}} />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h1>
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
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Panel
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Editar Proyecto: {project.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
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
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-gray-700 font-medium">
                  Área (m²) *
                </Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-800 focus:border-black focus:ring-black"
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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Descripción *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-gray-50 border-gray-300 text-gray-800 min-h-32 focus:border-black focus:ring-black"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Imagen Principal *</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="bg-gray-50 border-gray-300 text-gray-800"
                  />
                  <Upload className="h-5 w-5 text-gray-500" />
                </div>
                {formData.coverImage && (
                  <div className="relative inline-block">
                    <Image
                      src={formData.coverImage || "/placeholder.svg"}
                      alt="Cover preview"
                      width={200}
                      height={120}
                      className="rounded object-cover border"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                      onClick={() => setFormData({ ...formData, coverImage: "" })}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Imágenes Adicionales</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="bg-gray-50 border-gray-300 text-gray-800"
                  />
                  <Upload className="h-5 w-5 text-gray-500" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        width={100}
                        height={80}
                        className="rounded object-cover border w-full h-20"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.push("/admin")} className="px-6 py-2">
                Cancelar
              </Button>
              <Button type="submit" className="btn-black px-6 py-2">
                Actualizar Proyecto
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

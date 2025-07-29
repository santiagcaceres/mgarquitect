"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { LoadingScreen } from "@/components/loading-screen"

interface HeroProject {
  id: string
  title: string
  description: string
  image: string
}

interface HeroSettings {
  mainTitle: string
  subtitle: string
  projects: HeroProject[]
}

const defaultHeroSettings: HeroSettings = {
  mainTitle: "MG ARQUITECTURA",
  subtitle: "Desarrollo integral de proyectos arquitectónicos",
  projects: [
    {
      id: "1",
      title: "Diseño de Interiores",
      description: "Espacios funcionales y estéticamente atractivos",
      image: "/placeholder.svg?height=800&width=1200&text=Diseño+de+Interiores",
    },
    {
      id: "2",
      title: "Relevamiento Topográfico",
      description: "Medición precisa de terrenos y niveles",
      image: "/placeholder.svg?height=800&width=1200&text=Relevamiento+Topográfico",
    },
    {
      id: "3",
      title: "Arquitectura Residencial",
      description: "Viviendas modernas y funcionales",
      image: "/placeholder.svg?height=800&width=1200&text=Arquitectura+Residencial",
    },
  ],
}

export default function ConfigurarBannerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<HeroSettings>(defaultHeroSettings)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = sessionStorage.getItem("mg-admin-authenticated")
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    // Cargar configuración guardada
    try {
      const savedHeroSettings = localStorage.getItem("mg-arquitectura-hero")
      if (savedHeroSettings) {
        const parsed = JSON.parse(savedHeroSettings)
        setFormData(parsed)
      }
    } catch (error) {
      console.error("Error loading hero settings:", error)
      setFormData(defaultHeroSettings)
    }

    setIsLoading(false)
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, projectIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const newProjects = [...formData.projects]
        newProjects[projectIndex] = { ...newProjects[projectIndex], image: imageUrl }
        setFormData({ ...formData, projects: newProjects })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateProject = (index: number, field: keyof HeroProject, value: string) => {
    const newProjects = [...formData.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setFormData({ ...formData, projects: newProjects })
  }

  const addProject = () => {
    const newProject: HeroProject = {
      id: Date.now().toString(),
      title: "",
      description: "",
      image: "",
    }
    setFormData({ ...formData, projects: [...formData.projects, newProject] })
  }

  const removeProject = (index: number) => {
    if (formData.projects.length > 1) {
      const newProjects = formData.projects.filter((_, i) => i !== index)
      setFormData({ ...formData, projects: newProjects })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validar que todos los proyectos tengan título y descripción
      const validProjects = formData.projects.filter((p) => p.title.trim() && p.description.trim())

      if (validProjects.length === 0) {
        alert("Debe tener al menos un slide con título y descripción")
        setIsSaving(false)
        return
      }

      const dataToSave = {
        ...formData,
        projects: validProjects,
      }

      // Guardar en localStorage
      localStorage.setItem("mg-arquitectura-hero", JSON.stringify(dataToSave))

      // Verificar que se guardó correctamente
      const saved = localStorage.getItem("mg-arquitectura-hero")
      if (saved) {
        console.log("Hero settings saved successfully:", JSON.parse(saved))

        // Guardar mensaje de éxito
        sessionStorage.setItem(
          "mg-admin-message",
          JSON.stringify({
            message: "Configuración del banner actualizada exitosamente",
            type: "success",
          }),
        )

        // Redirigir al admin
        router.push("/admin")
      } else {
        throw new Error("Failed to save to localStorage")
      }
    } catch (error) {
      console.error("Error saving hero settings:", error)
      alert("Error al guardar la configuración. Inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => {}} />
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
            <h1 className="text-2xl font-bold text-gray-800">Configurar Banner Principal</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <Label className="text-gray-700 font-medium text-lg">Slides del Banner</Label>
                <Button
                  type="button"
                  onClick={addProject}
                  className="btn-black flex items-center gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Agregar Slide
                </Button>
              </div>

              <div className="space-y-8">
                {formData.projects.map((project, index) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-semibold text-gray-800 text-lg">Slide {index + 1}</h4>
                      {formData.projects.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProject(index)}
                          className="flex items-center gap-2"
                          disabled={isSaving}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label className="text-gray-700 font-medium">Título del Slide *</Label>
                        <Input
                          value={project.title}
                          onChange={(e) => updateProject(index, "title", e.target.value)}
                          className="bg-white border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                          placeholder="Título del slide"
                          required
                          disabled={isSaving}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Descripción *</Label>
                        <Input
                          value={project.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          className="bg-white border-gray-300 text-gray-800 focus:border-black focus:ring-black"
                          placeholder="Descripción del slide"
                          required
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium">Imagen del Slide</Label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="bg-white border-gray-300 text-gray-800"
                            disabled={isSaving}
                          />
                          <Upload className="h-5 w-5 text-gray-500" />
                        </div>
                        {project.image && (
                          <div className="relative inline-block">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={`Slide ${index + 1}`}
                              width={200}
                              height={120}
                              className="rounded object-cover border"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                              onClick={() => updateProject(index, "image", "")}
                              disabled={isSaving}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                {isSaving ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

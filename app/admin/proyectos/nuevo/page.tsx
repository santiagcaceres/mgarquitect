"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, X, Info } from "lucide-react"
import { toast } from "sonner"
import { createOrUpdateProject } from "@/app/actions/projects"
import Image from "next/image"

export default function NuevoProyectoPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [otherPreviews, setOtherPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    year: new Date().getFullYear().toString(),
    location: "",
    area: "",
  })

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const previews: string[] = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        previews.push(event.target?.result as string)
        if (previews.length === files.length) {
          setOtherPreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeCoverPreview = () => {
    setCoverPreview(null)
    const input = document.getElementById("coverImage") as HTMLInputElement
    if (input) input.value = ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const form = e.target as HTMLFormElement
      const formDataToSend = new FormData(form)

      // Agregar datos del estado
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.set(key, value)
      })

      const result = await createOrUpdateProject(formDataToSend)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Proyecto creado exitosamente")
        router.push("/admin/proyectos")
      }
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/admin/proyectos")} disabled={isPending}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Proyectos
        </Button>
        <h1 className="text-3xl font-bold">Nuevo Proyecto</h1>
      </div>

      {/* Información sobre imágenes */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Información sobre Imágenes
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
              <strong>Resolución recomendada:</strong> 1200x800 píxeles mínimo
            </li>
            <li>
              <strong>Imagen de portada:</strong> Se mostrará como imagen principal
            </li>
            <li>
              <strong>Imágenes adicionales:</strong> Se mostrarán en la galería del proyecto
            </li>
          </ul>
        </CardContent>
      </Card>

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
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: Casa Moderna en Montevideo"
                  disabled={isPending}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="Ej: Residencial, Comercial, Industrial"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe el proyecto, sus características principales y lo que lo hace especial..."
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
                  name="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="2024"
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Montevideo, Uruguay"
                  disabled={isPending}
                />
              </div>
              <div>
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="250 m²"
                  disabled={isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imágenes del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Imagen de portada */}
            <div>
              <Label htmlFor="coverImage">Imagen de Portada *</Label>
              <div className="mt-2">
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  disabled={isPending}
                  className="mb-4"
                />
                {coverPreview && (
                  <div className="relative inline-block">
                    <Image
                      src={coverPreview || "/placeholder.svg"}
                      alt="Vista previa"
                      width={200}
                      height={150}
                      className="rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      onClick={removeCoverPreview}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Esta será la imagen principal que se mostrará en la lista de proyectos
              </p>
            </div>

            {/* Imágenes adicionales */}
            <div>
              <Label htmlFor="otherImages">Imágenes Adicionales</Label>
              <div className="mt-2">
                <Input
                  id="otherImages"
                  name="otherImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImagesChange}
                  disabled={isPending}
                  className="mb-4"
                />
                {otherPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {otherPreviews.map((preview, index) => (
                      <Image
                        key={index}
                        src={preview || "/placeholder.svg"}
                        alt={`Vista previa ${index + 1}`}
                        width={150}
                        height={100}
                        className="rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Estas imágenes se mostrarán en la galería del proyecto (opcional)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/proyectos")} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="bg-black hover:bg-gray-800 text-white">
            {isPending ? "Creando..." : "Crear Proyecto"}
          </Button>
        </div>
      </form>
    </div>
  )
}

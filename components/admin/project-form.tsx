"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { createOrUpdateProject } from "@/app/actions/projects"
import type { Project } from "@/lib/supabase"
import Image from "next/image"
import { X } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(3, "El título es requerido"),
  category: z.string().min(3, "La categoría es requerida"),
  year: z.string().length(4, "El año debe tener 4 dígitos"),
  location: z.string().min(3, "La ubicación es requerida"),
  area: z.string().min(1, "El área es requerida"),
  description: z.string().min(10, "La descripción es requerida"),
})

interface ProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [otherFiles, setOtherFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState(project?.project_images || [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      category: project?.category || "",
      year: project?.year || "",
      location: project?.location || "",
      area: project?.area || "",
      description: project?.description || "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      if (project?.id) {
        formData.append("id", project.id)
      }

      if (coverFile) {
        formData.append("coverImage", coverFile)
      }

      otherFiles.forEach((file) => {
        formData.append("otherImages", file)
      })

      formData.append("existingImages", JSON.stringify(existingImages))

      const result = await createOrUpdateProject(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(project ? "Proyecto actualizado con éxito" : "Proyecto creado con éxito")
        router.push("/admin/proyectos")
        router.refresh()
      }
    })
  }

  const removeExistingImage = (imageId: string) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId))
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título del Proyecto</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" {...form.register("category")} placeholder="Ej: Residencial" />
              {form.formState.errors.category && (
                <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year">Año</Label>
              <Input id="year" {...form.register("year")} placeholder="Ej: 2024" />
              {form.formState.errors.year && (
                <p className="text-red-500 text-sm">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" {...form.register("location")} placeholder="Ej: Montevideo, Uruguay" />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="area">Área (m²)</Label>
              <Input id="area" {...form.register("area")} placeholder="Ej: 250" />
              {form.formState.errors.area && (
                <p className="text-red-500 text-sm">{form.formState.errors.area.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="coverImage">Imagen de Portada</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-gray-500 mt-1">Sube la imagen principal del proyecto.</p>
          </div>
          <div>
            <Label htmlFor="otherImages">Otras Imágenes</Label>
            <Input
              id="otherImages"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setOtherFiles(Array.from(e.target.files || []))}
            />
            <p className="text-sm text-gray-500 mt-1">Sube imágenes adicionales para la galería.</p>
          </div>
          {existingImages.length > 0 && (
            <div>
              <Label>Imágenes existentes</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt="Imagen existente"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : project ? "Guardar Cambios" : "Crear Proyecto"}
        </Button>
      </div>
    </form>
  )
}

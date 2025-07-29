"use client"

import { useRouter } from "next/navigation"
import { useFormState, useFormStatus } from "react-dom"
import { createProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useEffect } from "react"

const initialState = {
  message: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creando..." : "Crear Proyecto"}
    </Button>
  )
}

export default function NuevoProyectoPage() {
  const [state, formAction] = useFormState(createProject, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      toast.success("Proyecto creado con éxito")
      router.push("/admin/proyectos")
    }
    if (state?.errors) {
      Object.values(state.errors).forEach((error) => {
        if (Array.isArray(error)) {
          error.forEach((e) => toast.error(e))
        }
      })
    }
  }, [state, router])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nuevo Proyecto</h1>
      <form action={formAction} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Proyecto</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residencial">Residencial</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Corporativo">Corporativo</SelectItem>
                <SelectItem value="Sanitario">Sanitario</SelectItem>
                <SelectItem value="Topografía">Topografía</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Año</Label>
            <Input id="year" name="year" type="number" placeholder="2025" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" name="location" placeholder="Montevideo, Uruguay" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Área (m²)</Label>
            <Input id="area" name="area" placeholder="250 m²" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" rows={5} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select name="status" defaultValue="draft">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch id="is_featured" name="is_featured" />
            <Label htmlFor="is_featured">¿Es un proyecto destacado?</Label>
          </div>
        </div>

        {/* TODO: Image Upload Component */}
        <div className="space-y-2">
          <Label>Imágenes</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
            Componente de subida de imágenes irá aquí.
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

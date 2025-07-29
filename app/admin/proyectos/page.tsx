"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  category: string
  status: "draft" | "published"
  project_images: { image_url: string; is_cover: boolean }[]
}

export default function ProyectosAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchProjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        title,
        category,
        status,
        project_images (
          image_url,
          is_cover
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Error al cargar los proyectos")
      console.error(error)
    } else {
      setProjects(data as Project[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (projectId: string) => {
    // Aquí iría la lógica para eliminar imágenes de Supabase Storage primero
    const { error } = await supabase.from("projects").delete().eq("id", projectId)
    if (error) {
      toast.error("Error al eliminar el proyecto")
    } else {
      toast.success("Proyecto eliminado con éxito")
      fetchProjects() // Recargar la lista
    }
  }

  if (loading) return <div>Cargando proyectos...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <Link href="/admin/proyectos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const coverImage = project.project_images.find((img) => img.is_cover)?.image_url || "/placeholder.svg"
          return (
            <Card key={project.id}>
              <CardContent className="p-4">
                <Image
                  src={coverImage || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold truncate">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.category}</p>
                <div className="mt-2">
                  <Badge variant={project.status === "published" ? "default" : "secondary"}>
                    {project.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/admin/proyectos/${project.id}/editar`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará el proyecto y todas sus imágenes asociadas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No hay proyectos creados.</p>
          <p className="text-sm text-gray-400">Haz clic en "Nuevo Proyecto" para empezar.</p>
        </div>
      )}
    </div>
  )
}

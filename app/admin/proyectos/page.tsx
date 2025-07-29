"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, Briefcase } from "lucide-react"
import { projectsService, type Project } from "@/lib/supabase"
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
import { deleteProject } from "@/app/actions/projects"

export default function ProyectosAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  async function fetchProjects() {
    setLoading(true)
    try {
      const data = await projectsService.getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Error al cargar los proyectos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = (projectId: string, projectTitle: string) => {
    startTransition(async () => {
      const result = await deleteProject(projectId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Proyecto "${projectTitle}" eliminado con éxito`)
        fetchProjects() // Recargar la lista
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <Link href="/admin/proyectos/nuevo">
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const coverImage = project.project_images?.find((img) => img.is_cover)?.image_url
            return (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={coverImage || "/placeholder.svg?width=400&height=250&text=Sin+Imagen"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      <Eye className="h-3 w-3" />
                      Publicado
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold truncate mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex gap-2">
                    <Link href={`/admin/proyectos/editar/${project.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent" disabled={isPending}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1" disabled={isPending}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isPending ? "..." : "Eliminar"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el proyecto "{project.title}" y todas sus
                            imágenes asociadas permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id, project.title)}
                            disabled={isPending}
                          >
                            {isPending ? "Eliminando..." : "Confirmar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay proyectos creados</h3>
            <p className="text-gray-500 text-center mb-6">
              Comienza creando tu primer proyecto para mostrar en el sitio web.
            </p>
            <Link href="/admin/proyectos/nuevo">
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Proyecto
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

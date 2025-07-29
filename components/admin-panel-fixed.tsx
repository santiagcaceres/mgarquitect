"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, X, Settings, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { projectsService, testConnection } from "@/lib/supabase-fixed"

interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  area: string
  images: string[]
  cover_image: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

interface NotificationProps {
  message: string
  type: "success" | "error" | "info"
  isVisible: boolean
  onClose: () => void
}

function Notification({ message, type, isVisible, onClose }: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Aumentado a 5 segundos para leer errores
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"
  const Icon = type === "success" ? CheckCircle : AlertCircle

  return (
    <div
      className={`fixed top-4 right-4 z-[100] ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-right max-w-md`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-sm">{type === "error" ? "Error" : type === "success" ? "Éxito" : "Info"}</p>
          <p className="text-sm opacity-90 mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 h-6 w-6 p-0 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Proyectos por defecto (fallback)
const defaultProjects: Project[] = [
  {
    id: "default-1",
    title: "Casa Moderna Minimalista",
    description: "Diseño contemporáneo con líneas limpias y espacios abiertos",
    category: "Residencial",
    year: "2024",
    location: "Montevideo, Uruguay",
    area: "180 m²",
    images: ["/placeholder.svg?height=400&width=600&text=Interior"],
    cover_image: "/placeholder.svg?height=400&width=600&text=Casa+Moderna",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function AdminPanel() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
    isVisible: boolean
  }>({
    message: "",
    type: "info",
    isVisible: false,
  })

  const router = useRouter()

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    console.log(`Notification [${type}]:`, message)
    setNotification({ message, type, isVisible: true })
  }

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  // Verificar autenticación y mensajes al cargar
  useEffect(() => {
    const isAuth = sessionStorage.getItem("mg-admin-authenticated")
    if (isAuth) {
      setIsAuthenticated(true)

      const pendingMessage = sessionStorage.getItem("mg-admin-message")
      if (pendingMessage) {
        try {
          const { message, type } = JSON.parse(pendingMessage)
          showNotification(message, type)
          sessionStorage.removeItem("mg-admin-message")
        } catch (error) {
          console.error("Error parsing pending message:", error)
        }
      }
    }
  }, [])

  // Probar conexión y cargar proyectos
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return

      setIsLoading(true)

      try {
        // Probar conexión primero
        console.log("Probando conexión con Supabase...")
        const connectionTest = await testConnection()
        setConnectionStatus(connectionTest)

        if (!connectionTest.success) {
          showNotification(`Error de conexión: ${connectionTest.message}`, "error")
          setProjects(defaultProjects) // Usar proyectos por defecto
          return
        }

        console.log("Conexión exitosa, cargando proyectos...")

        // Cargar proyectos desde Supabase
        const supabaseProjects = await projectsService.getAllProjects()

        if (supabaseProjects.length > 0) {
          console.log("Proyectos cargados desde Supabase:", supabaseProjects.length)
          setProjects(supabaseProjects)
        } else {
          console.log("No hay proyectos en Supabase, usando proyectos por defecto")
          setProjects(defaultProjects)
        }
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        showNotification(`Error al cargar datos: ${error.message}`, "error")
        setProjects(defaultProjects) // Usar proyectos por defecto en caso de error
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated])

  const handleLogin = () => {
    if (password === "mg2024") {
      setIsAuthenticated(true)
      sessionStorage.setItem("mg-admin-authenticated", "true")
      showNotification("Sesión iniciada correctamente", "success")
    } else {
      showNotification("Contraseña incorrecta", "error")
    }
  }

  const confirmDeleteProject = async () => {
    if (!deleteProjectId || isDeleting) return

    setIsDeleting(true)

    try {
      const projectToDelete = projects.find((p) => p.id === deleteProjectId)

      if (!projectToDelete) {
        throw new Error("Proyecto no encontrado")
      }

      console.log("Eliminando proyecto:", projectToDelete.title)

      // Intentar eliminar de Supabase
      if (connectionStatus?.success) {
        await projectsService.deleteProject(deleteProjectId)
      }

      // Actualizar estado local
      const updatedProjects = projects.filter((p) => p.id !== deleteProjectId)
      setProjects(updatedProjects)

      showNotification(`Proyecto "${projectToDelete.title}" eliminado exitosamente`, "success")
    } catch (error: any) {
      console.error("Error al eliminar proyecto:", error)
      showNotification(`Error al eliminar proyecto: ${error.message}`, "error")
    } finally {
      setDeleteProjectId(null)
      setIsDeleting(false)
    }
  }

  const toggleProjectStatus = async (id: string) => {
    try {
      const project = projects.find((p) => p.id === id)
      if (!project) {
        throw new Error("Proyecto no encontrado")
      }

      const newStatus = project.status === "published" ? "draft" : "published"

      console.log(`Cambiando estado del proyecto ${project.title} a ${newStatus}`)

      // Intentar actualizar en Supabase
      if (connectionStatus?.success) {
        await projectsService.updateProject(id, { status: newStatus })
      }

      // Actualizar estado local
      const updatedProjects = projects.map((p) =>
        p.id === id ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p,
      )
      setProjects(updatedProjects)

      showNotification(`Proyecto ${newStatus === "published" ? "publicado" : "guardado como borrador"}`, "success")
    } catch (error: any) {
      console.error("Error al cambiar estado del proyecto:", error)
      showNotification(`Error al cambiar estado: ${error.message}`, "error")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("mg-admin-authenticated")
    showNotification("Sesión cerrada", "info")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-black mb-2">Panel de Administración</h3>
            <p className="text-black">MG ARQUITECTURA</p>
          </div>
          <div className="space-y-4">
            <Label htmlFor="password" className="text-black">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="bg-gray-50 border-gray-300 text-black"
              placeholder="Ingresa la contraseña"
            />
            <button onClick={handleLogin} className="w-full py-2 px-4 rounded-md btn-black">
              Iniciar Sesión
            </button>
          </div>
        </div>
        <Notification {...notification} onClose={hideNotification} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-4">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-light text-gray-800">Panel de Administración</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/admin/configurar-banner")}
                  className="px-4 py-2 rounded-md flex items-center gap-2 btn-black"
                  disabled={isLoading}
                >
                  <Settings className="h-4 w-4" /> Banner
                </button>
                <button
                  onClick={() => router.push("/admin/nuevo-proyecto")}
                  className="px-4 py-2 rounded-md flex items-center gap-2 btn-black"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" /> Nuevo Proyecto
                </button>
              </div>
            </div>

            {/* Estado de conexión */}
            {connectionStatus && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  connectionStatus.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {connectionStatus.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <span>{connectionStatus.message}</span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 bg-gray-100">
                <TabsTrigger
                  value="projects"
                  className="text-black data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Proyectos ({projects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Card key={project.id} className="bg-white border-gray-200 shadow-lg">
                      <CardContent className="p-4 flex gap-6">
                        <Image
                          src={project.cover_image || "/placeholder.svg"}
                          alt={project.title}
                          width={160}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-3">
                          <h4 className="text-xl font-semibold text-black">{project.title}</h4>
                          <p className="text-black text-sm line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={project.status === "published" ? "bg-green-600" : "bg-yellow-600"}>
                              {project.status === "published" ? "Publicado" : "Borrador"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {project.category} • {project.year}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleProjectStatus(project.id)}
                            className="px-3 py-1 text-sm rounded border border-gray-300 text-black bg-white hover:bg-gray-50"
                            disabled={isLoading}
                          >
                            {project.status === "published" ? "Ocultar" : "Publicar"}
                          </button>
                          <button
                            onClick={() => router.push(`/admin/editar-proyecto/${project.id}`)}
                            className="px-3 py-1 text-sm rounded border border-gray-300 text-black bg-white hover:bg-gray-50 flex items-center justify-center"
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteProjectId(project.id)}
                            className="px-3 py-1 text-sm rounded text-white bg-red-600 hover:bg-red-700 flex items-center justify-center"
                            disabled={isDeleting || isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No hay proyectos creados.</p>
                    <p>Haz clic en "Nuevo Proyecto" para empezar.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded border border-gray-300 text-black bg-white hover:bg-gray-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteProjectId} onOpenChange={() => !isDeleting && setDeleteProjectId(null)}>
        <AlertDialogContent className="bg-white border-gray-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-black" disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Notification {...notification} onClose={hideNotification} />
    </div>
  )
}

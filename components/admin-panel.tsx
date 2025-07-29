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
import { Edit, Trash2, Plus, X, Settings } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"

  return (
    <div
      className={`fixed top-4 right-4 z-[100] ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right`}
    >
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 h-6 w-6 p-0 rounded flex items-center justify-center"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Proyectos por defecto
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
    coverImage: "/placeholder.svg?height=400&width=600&text=Casa+Moderna",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function AdminPanel() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")
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
  const [isLoading, setIsLoading] = useState(false)

  const showNotification = (message: string, type: "success" | "error" | "info") => {
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

  // Cargar proyectos del localStorage
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem("mg-arquitectura-projects")
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects)
          setProjects(Array.isArray(parsedProjects) ? parsedProjects : defaultProjects)
        } else {
          setProjects(defaultProjects)
          localStorage.setItem("mg-arquitectura-projects", JSON.stringify(defaultProjects))
        }
      } catch (error) {
        console.error("Error loading projects:", error)
        setProjects(defaultProjects)
      }
    }

    if (isAuthenticated) {
      loadProjects()
    }
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
    if (deleteProjectId && !isDeleting) {
      setIsDeleting(true)
      try {
        const projectToDelete = projects.find((p) => p.id === deleteProjectId)
        const updatedProjects = projects.filter((p) => p.id !== deleteProjectId)

        setProjects(updatedProjects)
        localStorage.setItem("mg-arquitectura-projects", JSON.stringify(updatedProjects))
        showNotification(`Proyecto "${projectToDelete?.title}" eliminado exitosamente`, "success")
      } catch (error) {
        showNotification("Error al eliminar el proyecto", "error")
      } finally {
        setDeleteProjectId(null)
        setIsDeleting(false)
      }
    }
  }

  const toggleProjectStatus = (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (project) {
      const newStatus = project.status === "published" ? "draft" : "published"
      const updatedProjects = projects.map((p) =>
        p.id === id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p,
      )
      setProjects(updatedProjects)
      localStorage.setItem("mg-arquitectura-projects", JSON.stringify(updatedProjects))
      showNotification(`Proyecto ${newStatus === "published" ? "publicado" : "ocultado"}`, "success")
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
          <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-light text-gray-800">Panel de Administración</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/admin/configurar-banner")}
                className="px-4 py-2 rounded-md flex items-center gap-2 btn-black"
              >
                <Settings className="h-4 w-4" /> Banner
              </button>
              <button
                onClick={() => router.push("/admin/nuevo-proyecto")}
                className="px-4 py-2 rounded-md flex items-center gap-2 btn-black"
              >
                <Plus className="h-4 w-4" /> Nuevo Proyecto
              </button>
            </div>
          </div>

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
                        src={project.coverImage || "/placeholder.svg"}
                        alt={project.title}
                        width={160}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-3">
                        <h4 className="text-xl font-semibold text-black">{project.title}</h4>
                        <p className="text-black text-sm line-clamp-2">{project.description}</p>
                        <Badge className={project.status === "published" ? "bg-green-600" : "bg-yellow-600"}>
                          {project.status === "published" ? "Publicado" : "Borrador"}
                        </Badge>
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
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteProjectId(project.id)}
                          className="px-3 py-1 text-sm rounded text-white bg-red-600 hover:bg-red-700 flex items-center justify-center"
                          disabled={isDeleting}
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
            <AlertDialogDescription className="text-black">Esta acción no se puede deshacer.</AlertDialogDescription>
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

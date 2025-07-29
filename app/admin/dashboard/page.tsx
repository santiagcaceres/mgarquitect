"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Settings, Plus, BarChart3, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { projectsService, testConnection } from "@/lib/supabase"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
  })
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Probar conexión
        const connection = await testConnection()
        setConnectionStatus(connection)

        // Cargar estadísticas
        const allProjects = await projectsService.getAllProjects()
        const publishedProjects = await projectsService.getPublishedProjects()

        setStats({
          totalProjects: allProjects.length,
          publishedProjects: publishedProjects.length,
          draftProjects: allProjects.length - publishedProjects.length,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        setConnectionStatus({
          success: false,
          message: "Error al cargar los datos del dashboard",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/proyectos/nuevo">
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </Link>
      </div>

      {/* Estado de la conexión */}
      {connectionStatus && (
        <Card className={connectionStatus.success ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {connectionStatus.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <span className={connectionStatus.success ? "text-green-800" : "text-yellow-800"}>
                {connectionStatus.message}
              </span>
            </div>
            {!connectionStatus.success && (
              <div className="mt-3 text-sm text-yellow-700">
                <p>
                  <strong>Para activar todas las funciones:</strong>
                </p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Configura las variables de entorno en Vercel</li>
                  <li>Ejecuta el script SQL en Supabase</li>
                  <li>Crea el bucket 'project-images' público</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {connectionStatus?.success ? "En base de datos" : "Datos de ejemplo"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedProjects}</div>
            <p className="text-xs text-muted-foreground">Visibles en el sitio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modo</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectionStatus?.success ? "REAL" : "DEMO"}</div>
            <p className="text-xs text-muted-foreground">
              {connectionStatus?.success ? "Base de datos activa" : "Datos de ejemplo"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/proyectos">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Briefcase className="mr-2 h-4 w-4" />
                Ver Todos los Proyectos
              </Button>
            </Link>
            <Link href="/admin/proyectos/nuevo">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nuevo Proyecto
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración del Sitio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/configuraciones">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Banner Principal
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Sitio Web
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

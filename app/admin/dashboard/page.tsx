"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Settings, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"
import { projectsService } from "@/lib/supabase"

export default function AdminDashboard() {
  const [totalProjects, setTotalProjects] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const projects = await projectsService.getPublishedProjects()
        setTotalProjects(projects.length)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
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

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">Proyectos en el sitio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✅ ACTIVO</div>
            <p className="text-xs text-muted-foreground">Sistema funcionando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuración</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">OK</div>
            <p className="text-xs text-muted-foreground">Todo configurado</p>
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
                Ver Todos los Proyectos ({totalProjects})
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

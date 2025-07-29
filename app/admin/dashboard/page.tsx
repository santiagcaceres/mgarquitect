"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Star, Layers } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Stats {
  totalProjects: number
  featuredProjects: number
  categories: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const { data: projects, error } = await supabase.from("projects").select("category, is_featured")

        if (error) throw error

        const totalProjects = projects.length
        const featuredProjects = projects.filter((p) => p.is_featured).length
        const categories = new Set(projects.map((p) => p.category)).size

        setStats({ totalProjects, featuredProjects, categories })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="text-center">Cargando estadísticas...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Proyectos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProjects ?? "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Destacados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.featuredProjects ?? "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.categories ?? "..."}</div>
          </CardContent>
        </Card>
      </div>
      {/* Aquí se pueden agregar más componentes, como proyectos recientes, etc. */}
    </div>
  )
}

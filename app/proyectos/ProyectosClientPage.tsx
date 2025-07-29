"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapPin, Home, Ruler } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"
import { projectsService, type Project } from "@/lib/supabase"

export default function ProyectosClientPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await projectsService.getPublishedProjects()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    if (!isLoading) {
      fetchProjects()
    }
  }, [isLoading])

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-black">Todos Nuestros Proyectos</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explora nuestra colección completa de proyectos arquitectónicos. Cada uno representa nuestro compromiso
              con la excelencia, la innovación y la satisfacción del cliente.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const coverImage = project.project_images?.find((img) => img.is_cover)?.image_url || "/placeholder.svg"
                return (
                  <Link key={project.id} href={`/proyecto/${project.id}`}>
                    <article className="group bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-96 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative overflow-hidden h-48">
                        <Image
                          src={coverImage || "/placeholder.svg"}
                          alt={`${project.title} - Proyecto arquitectónico en ${project.location}`}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-bold mb-3 text-black group-hover:text-gray-700 transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-1">{project.description}</p>

                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Home className="h-4 w-4" />
                            <span>{project.category}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Ruler className="h-4 w-4" />
                            <span>{project.area}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs text-gray-400">
                            <span>Año: {project.year}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No hay proyectos publicados en este momento.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

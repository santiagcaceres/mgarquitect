"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapPin, Home, Ruler, ArrowRight } from "lucide-react"
import Link from "next/link"
import { projectsService, type Project } from "@/lib/supabase"

export function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await projectsService.getPublishedProjects()
        setProjects(data.slice(0, 6)) // Mostrar solo los primeros 6 proyectos
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="proyectos" className="py-12 bg-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </section>
    )
  }

  const displayedProjects = projects.length > 5 ? [...projects, ...projects] : projects

  return (
    <section id="proyectos" className="py-12 bg-gray-200 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-black">Nuestros Proyectos</h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Cada proyecto es una historia única de creatividad, innovación y excelencia arquitectónica
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Home className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Próximamente</h3>
              <p className="text-gray-500">
                Estamos trabajando en nuevos proyectos increíbles que pronto estarán disponibles para mostrar.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="marquee-container mb-12">
              <div className="marquee-content">
                {displayedProjects.map((project, index) => {
                  const coverImage =
                    project.project_images?.find((img) => img.is_cover)?.image_url || "/placeholder.svg"
                  return (
                    <Link key={`${project.id}-${index}`} href={`/proyecto/${project.id}`}>
                      <div className="marquee-item group bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-96 flex flex-col">
                        <div className="relative overflow-hidden h-48">
                          <Image
                            src={coverImage || "/placeholder.svg"}
                            alt={project.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold mb-2 text-black">{project.title}</h3>
                          <p className="text-black mb-3 text-sm flex-1">{project.description}</p>
                          <div className="space-y-1 mt-auto">
                            <div className="flex items-center gap-2 text-black text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-black text-sm">
                              <Home className="h-4 w-4" />
                              <span>{project.category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-black text-sm">
                              <Ruler className="h-4 w-4" />
                              <span>{project.area}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="relative flex justify-center">
              <Link
                href="/proyectos"
                className="group relative z-10 px-8 py-4 text-lg font-semibold text-white border-none rounded-full overflow-hidden transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl"
                style={{
                  backgroundColor: "#000",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                  Ver Todos los Proyectos
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

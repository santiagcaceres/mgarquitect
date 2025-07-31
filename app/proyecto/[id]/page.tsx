"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { MapPin, Home, Ruler, Phone, Mail, Calendar, ArrowLeft, X } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { projectsService, type Project } from "@/lib/supabase"
import { trackProjectView, trackWhatsAppClick, trackEmailClick } from "@/lib/gtag"

export default function ProyectoPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchProject() {
      if (!params.id) return

      try {
        const projectId = params.id as string
        const data = await projectsService.getProjectById(projectId)
        setProject(data)

        // Rastrear visualización del proyecto
        if (data) {
          trackProjectView(data.title)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
      }
    }

    if (!isLoading) {
      fetchProject()
    }
  }, [params.id, isLoading])

  const handlePhoneClick = () => {
    trackWhatsAppClick()
    window.open("https://wa.me/59892078496", "_blank")
  }

  const handleEmailClick = () => {
    trackEmailClick()
    const email = "proyectos.mgimenez@gmail.com"
    const subject = "Consulta sobre proyecto similar"
    const body = `Hola, me interesa un proyecto similar a "${project?.title}". Me gustaría conocer más detalles.`

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  const openImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setModalImageUrl("")
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImageModal()
      }
    }

    if (isImageModalOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isImageModalOpen])

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="pt-20 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Proyecto no encontrado</h1>
          <p className="text-gray-600 mb-8">El proyecto que buscas no existe o ha sido eliminado.</p>
          <Link href="/proyectos">
            <Button className="bg-black hover:bg-gray-800 text-white">Volver a Proyectos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const allImages = project.project_images || []
  const coverImage = allImages.find((img) => img.is_cover)?.image_url || "/placeholder.svg"
  const additionalImages = allImages.filter((img) => !img.is_cover)
  const displayImages = [{ image_url: coverImage, is_cover: true }, ...additionalImages]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-4">
          <Link href="/proyectos">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Todos los Proyectos
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div
                className="relative cursor-pointer"
                onClick={() => openImageModal(displayImages[currentImageIndex]?.image_url || "/placeholder.svg")}
              >
                <Image
                  src={displayImages[currentImageIndex]?.image_url || "/placeholder.svg"}
                  alt={project.title}
                  width={800}
                  height={600}
                  className="w-full h-96 object-cover rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                  <span className="hidden md:inline">Click para ampliar</span>
                  <span className="md:hidden">Toca para ampliar</span>
                </div>
              </div>

              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index)
                        openImageModal(image.image_url || "/placeholder.svg")
                      }}
                      className={`relative h-20 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                        currentImageIndex === index ? "ring-2 ring-black shadow-lg" : "hover:shadow-md"
                      }`}
                    >
                      <Image
                        src={image.image_url || "/placeholder.svg"}
                        alt={`${project.title} ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-6 text-black">{project.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{project.description}</p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-black">Detalles del Proyecto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 text-gray-600">
                    <MapPin className="h-6 w-6 text-black flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-black">Ubicación:</span>
                      <p>{project.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <Home className="h-6 w-6 text-black flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-black">Categoría:</span>
                      <p>{project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <Ruler className="h-6 w-6 text-black flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-black">Área:</span>
                      <p>{project.area}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <Calendar className="h-6 w-6 text-black flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-black">Año:</span>
                      <p>{project.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-black">¿Te interesa un proyecto similar?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Contactanos para discutir tu proyecto y cómo podemos ayudarte a materializarlo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handlePhoneClick}
                    className="flex-1 bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium flex items-center justify-center gap-3"
                  >
                    <Phone className="h-5 w-5" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleEmailClick}
                    className="flex-1 bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium flex items-center justify-center gap-3"
                  >
                    <Mail className="h-5 w-5" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-7xl max-h-full">
            <Image
              src={modalImageUrl || "/placeholder.svg"}
              alt={project.title}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
              <span className="hidden md:inline">Presiona ESC o click fuera para cerrar</span>
              <span className="md:hidden">Toca fuera de la imagen para cerrar</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroService, type HeroSlide } from "@/lib/supabase"

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlides() {
      try {
        const data = await heroService.getHeroSlides()
        setSlides(data)
      } catch (error) {
        console.error("Error fetching hero slides:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  if (loading) {
    return (
      <section id="inicio" className="relative h-screen bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section id="inicio" className="relative h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">MG ARQUITECTURA</h1>
          <p className="text-lg md:text-xl text-white/90">Desarrollo integral de proyectos arquitectónicos</p>
          <div className="mt-8 p-4 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-200 text-sm">
              📝 Configura los slides del banner desde el panel de administración
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="inicio" className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image_url || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="absolute bottom-20 left-8 md:left-16 z-10 text-white max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-in fade-in-5 slide-in-from-bottom-4 duration-700">
          {slides[currentSlide]?.title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 drop-shadow-lg animate-in fade-in-5 slide-in-from-bottom-2 duration-700 delay-200">
          {slides[currentSlide]?.description}
        </p>
      </div>

      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 h-12 w-12 rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 h-12 w-12 rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125" : "bg-white/50"}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

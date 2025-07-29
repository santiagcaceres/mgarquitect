"use client"

import { useState } from "react"
import { HeroSlider } from "@/components/hero-slider"
import { AboutSection } from "@/components/about-section"
import { ProjectsGallery } from "@/components/projects-gallery"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSlider />
        <AboutSection />
        <ProjectsGallery />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

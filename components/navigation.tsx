"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full backdrop-blur-sm z-50 border-b border-gray-800 transition-all duration-500 ease-in-out ${
        isScrolled ? "bg-black/95 py-4" : "bg-black/95 py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center relative">
          <div
            className={`transition-all duration-500 ease-in-out ${
              isScrolled ? "absolute left-1/2 transform -translate-x-1/2" : ""
            }`}
          >
            <Link href="/">
              <Image
                src="/images/logo-header.png"
                alt="MG Arquitectura"
                width={isScrolled ? 60 : 80}
                height={isScrolled ? 30 : 40}
                className="object-contain cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 brightness-0 invert"
                style={{ maxHeight: isScrolled ? "30px" : "40px" }}
              />
            </Link>
          </div>

          {!isScrolled && (
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-white font-medium hover:text-gray-300 transition-colors duration-300"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("nosotros")}
                className="text-white font-medium hover:text-gray-300 transition-colors duration-300"
              >
                Nosotros
              </button>
              <Link
                href="/proyectos"
                className="text-white font-medium hover:text-gray-300 transition-colors duration-300"
              >
                Proyectos
              </Link>
              <button
                onClick={() => scrollToSection("servicios")}
                className="text-white font-medium hover:text-gray-300 transition-colors duration-300"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-white font-medium hover:text-gray-300 transition-colors duration-300"
              >
                Contacto
              </button>
            </div>
          )}

          {!isScrolled && (
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>

        {isOpen && !isScrolled && (
          <div className="md:hidden py-4 border-t border-gray-800 mt-4 animate-in fade-in duration-300">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-white font-medium text-left hover:text-gray-300 transition-colors duration-300"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("nosotros")}
                className="text-white font-medium text-left hover:text-gray-300 transition-colors duration-300"
              >
                Nosotros
              </button>
              <Link
                href="/proyectos"
                className="text-white font-medium text-left hover:text-gray-300 transition-colors duration-300"
              >
                Proyectos
              </Link>
              <button
                onClick={() => scrollToSection("servicios")}
                className="text-white font-medium text-left hover:text-gray-300 transition-colors duration-300"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-white font-medium text-left hover:text-gray-300 transition-colors duration-300"
              >
                Contacto
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

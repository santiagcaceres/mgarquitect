"use client"

import Image from "next/image"

interface MGLogoProps {
  variant?: "white" | "black"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MGLogo({ variant = "white", size = "md", className = "" }: MGLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
  }

  const filterClasses = {
    white: "", // Logo original (blanco sobre negro)
    black: "brightness-0 invert", // Invertir colores para negro sobre blanco
  }

  return (
    <Image
      src="/images/mg-logo-new.png"
      alt="MG Arquitectura"
      width={200}
      height={200}
      className={`object-contain ${sizeClasses[size]} ${filterClasses[variant]} ${className}`}
    />
  )
}

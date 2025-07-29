"use client"

import { useState, useEffect } from "react"
import { AdminPanel } from "@/components/admin-panel"
import { ErrorMessage } from "@/components/error-message"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simular una comprobación o carga inicial
    try {
      // Aquí podrías verificar la sesión del usuario en el futuro
      if (typeof window === "undefined") {
        throw new Error("Este panel solo funciona en el cliente.")
      }
      // Redirigir automáticamente al dashboard
      router.push("/admin/dashboard")
      setIsLoading(false)
    } catch (e: any) {
      setError(e.message)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ErrorMessage title="Error al Cargar el Panel" message={error} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminPanel />
    </div>
  )
}

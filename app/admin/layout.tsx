"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Si estamos en la página de login, no verificar autenticación
    if (pathname === "/admin/login") {
      setIsAuthenticated(true) // Permitir acceso a login
      return
    }

    // Para todas las demás páginas del admin, verificar autenticación
    const auth = sessionStorage.getItem("mg-admin-authenticated")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router, pathname])

  // Mostrar loading mientras verificamos autenticación
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Si estamos en login, mostrar solo el contenido sin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Para todas las demás páginas del admin, mostrar con sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}

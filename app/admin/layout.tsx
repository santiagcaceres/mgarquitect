"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true)
      return
    }

    const auth = sessionStorage.getItem("mg-admin-authenticated")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router, pathname])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      <Toaster />
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Briefcase, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

const navItems = [
  { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
  { href: "/admin/proyectos", icon: Briefcase, label: "Proyectos" },
  { href: "/admin/configuraciones", icon: Settings, label: "Configuraciones" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem("mg-admin-authenticated")
    router.push("/admin/login")
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/admin/dashboard">
          <Image
            src="/images/logo-admin.png"
            alt="MG Arquitectura"
            width={100}
            height={50}
            className="mx-auto object-contain"
          />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              pathname === item.href ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-200" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 border-b bg-white">
        <Link href="/admin/dashboard">
          <Image src="/images/logo-admin.png" alt="MG Arquitectura" width={80} height={40} className="object-contain" />
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r">{sidebarContent}</aside>
    </>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simular un pequeño delay para mostrar el loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email === "proyectos.mgimenez@gmail.com" && password === "mgadmin2025") {
      sessionStorage.setItem("mg-admin-authenticated", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Credenciales incorrectas")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Image
              src="/images/logo-admin.png"
              alt="MG Arquitectura"
              width={120}
              height={60}
              className="mx-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
          <CardDescription>Inicia sesión para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="proyectos.mgimenez@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Credenciales de prueba:</p>
            <p>
              <strong>Email:</strong> proyectos.mgimenez@gmail.com
            </p>
            <p>
              <strong>Contraseña:</strong> mgadmin2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

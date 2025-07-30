"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"
import { useActionState, useRef, useEffect } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import { toast } from "sonner"

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(sendContactEmail, null)

  const handlePhoneClick = () => {
    window.open("https://wa.me/59892078496", "_blank")
  }

  const handleEmailClick = () => {
    const email = "proyectos@mgarquitecturauy.com"
    const subject = "Consulta desde MG Arquitectura"
    const body = "Hola, me interesa conocer más sobre sus servicios arquitectónicos."

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  // Manejar respuestas del servidor
  useEffect(() => {
    if (state?.success) {
      // Mostrar toast de éxito con ícono verde
      toast.success(state.message, {
        duration: 5000,
        style: {
          background: "#10B981",
          color: "white",
          border: "none",
          fontSize: "16px",
          fontWeight: "500",
        },
        icon: "✅",
      })
      formRef.current?.reset() // Limpiar el formulario
    } else if (state?.error) {
      // Mostrar toast de error
      toast.error(state.error, {
        duration: 6000,
        style: {
          background: "#EF4444",
          color: "white",
          border: "none",
          fontSize: "16px",
          fontWeight: "500",
        },
        icon: "❌",
      })
    }
  }, [state])

  return (
    <section id="contacto" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-black">Contactanos</h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            No dudes en contactarnos para ayudarte a materializar tus ideas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-black">Envíanos un mensaje</h3>
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="Nombre"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                  required
                  disabled={isPending}
                />
                <Input
                  name="lastName"
                  placeholder="Apellido"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                  required
                  disabled={isPending}
                />
              </div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                required
                disabled={isPending}
              />
              <Input
                name="phone"
                placeholder="Teléfono (opcional)"
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                disabled={isPending}
              />
              <Input
                name="subject"
                placeholder="Asunto"
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                required
                disabled={isPending}
              />
              <Textarea
                name="message"
                placeholder="Cuéntanos sobre tu proyecto..."
                className="min-h-32 bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                required
                disabled={isPending}
              />
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium transition-all duration-200"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando mensaje...
                  </span>
                ) : (
                  "Enviar Mensaje"
                )}
              </Button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-black">Información de Contacto</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-black text-lg">Ubicación</h4>
                  <p className="text-gray-600">Montevideo, Uruguay</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-black text-lg">Teléfono</h4>
                  <button
                    onClick={handlePhoneClick}
                    className="text-gray-600 hover:text-black transition-colors underline"
                  >
                    +598 92 078 496
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-black text-lg">Email</h4>
                  <button
                    onClick={handleEmailClick}
                    className="text-gray-600 hover:text-black transition-colors underline"
                  >
                    proyectos@mgarquitecturauy.com
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

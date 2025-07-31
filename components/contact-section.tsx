"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, CheckCircle, X } from "lucide-react"
import { useFormState } from "react-dom"
import { useRef, useEffect, useState } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import { toast } from "sonner"
import { trackContactFormSubmit, trackWhatsAppClick, trackPhoneClick, trackEmailClick } from "@/lib/gtag"

// Componente de Modal de Éxito Elegante
function SuccessModal({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string }) {
  useEffect(() => {
    if (isOpen) {
      // Auto cerrar después de 5 segundos
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-300">
        {/* Header con animación */}
        <div className="relative p-8 text-center">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Ícono de éxito con animación */}
          <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500 delay-100">
            <CheckCircle className="h-8 w-8 text-green-600 animate-in zoom-in-50 duration-700 delay-300" />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-200">
            ¡Mensaje Enviado!
          </h3>

          {/* Mensaje */}
          <p className="text-gray-600 leading-relaxed mb-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 delay-300">
            {message}
          </p>

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-4 animate-in fade-in-50 slide-in-from-bottom-1 duration-500 delay-400">
            <p className="text-sm text-gray-500 mb-2">
              <strong className="text-gray-700">Tiempo de respuesta:</strong> 24-48 horas
            </p>
            <p className="text-sm text-gray-500">
              <strong className="text-gray-700">También puedes contactarnos:</strong>
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={() => {
                  trackWhatsAppClick()
                  window.open("https://wa.me/59892078496", "_blank")
                }}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                WhatsApp
              </button>
              <button
                onClick={() => {
                  trackPhoneClick()
                  window.location.href = "tel:+59892078496"
                }}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Llamar
              </button>
            </div>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] animate-in fade-in-50 slide-in-from-bottom-1 duration-500 delay-500"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useFormState(sendContactEmail, null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handlePhoneClick = () => {
    trackWhatsAppClick()
    window.open("https://wa.me/59892078496", "_blank")
  }

  const handleEmailClick = () => {
    trackEmailClick()
    const email = "proyectos@mgarquitecturauy.com"
    const subject = "Consulta desde MG Arquitectura"
    const body = "Hola, me interesa conocer más sobre sus servicios arquitectónicos."

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  // Manejar respuestas del servidor
  useEffect(() => {
    if (state?.success) {
      // Rastrear envío exitoso del formulario
      trackContactFormSubmit()
      // Mostrar modal de éxito elegante
      setShowSuccessModal(true)
      formRef.current?.reset() // Limpiar el formulario
    } else if (state?.error) {
      // Mostrar toast de error (mantener el toast para errores)
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
    <>
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
                  />
                  <Input
                    name="lastName"
                    placeholder="Apellido"
                    className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                    required
                  />
                </div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                  required
                />
                <Input
                  name="phone"
                  placeholder="Teléfono (opcional)"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                />
                <Input
                  name="subject"
                  placeholder="Asunto"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Cuéntanos sobre tu proyecto..."
                  className="min-h-32 bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium transition-all duration-200"
                >
                  Enviar Mensaje
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

      {/* Modal de Éxito Elegante */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={state?.message || "¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo en breve."}
      />
    </>
  )
}

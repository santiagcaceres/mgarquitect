"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"

export function ContactSection() {
  const handlePhoneClick = () => {
    window.open("https://wa.me/59892078496", "_blank")
  }

  const handleEmailClick = () => {
    const email = "proyectos.mgimenez@gmail.com"
    const subject = "Consulta desde MG Arquitectura"
    const body = "Hola, me interesa conocer más sobre sus servicios arquitectónicos."

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

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
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nombre"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                />
                <Input
                  placeholder="Apellido"
                  className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
              />
              <Input
                placeholder="Teléfono"
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
              />
              <Input
                placeholder="Asunto"
                className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
              />
              <Textarea
                placeholder="Cuéntanos sobre tu proyecto..."
                className="min-h-32 bg-gray-50 border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
              />
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-medium">
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
                    proyectos.mgimenez@gmail.com
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

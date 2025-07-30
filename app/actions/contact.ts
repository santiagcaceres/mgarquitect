"use server"

import { Resend } from "resend"

interface ContactFormState {
  success?: boolean
  error?: string
  message?: string
}

// Inicializa Resend con tu nueva API Key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(
  prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Validaciones básicas
  if (!firstName || !lastName || !email || !subject || !message) {
    return { error: "Por favor, completa todos los campos obligatorios." }
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Por favor, ingresa un email válido." }
  }

  // Construir el cuerpo del email en HTML para mejor presentación
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          Nueva Consulta desde MG Arquitectura
        </h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Datos del Cliente:</h3>
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${firstName} ${lastName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #000;">${email}</a></p>
          <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
          <p style="margin: 8px 0;"><strong>Asunto:</strong> ${subject}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Mensaje:</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #000;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>Este mensaje fue enviado desde el formulario de contacto de <strong>mgarquitecturauy.com</strong></p>
          <p>Fecha: ${new Date().toLocaleString("es-UY", { timeZone: "America/Montevideo" })}</p>
        </div>
      </div>
    </div>
  `

  // Versión en texto plano como respaldo
  const emailText = `
Nueva Consulta desde MG Arquitectura

DATOS DEL CLIENTE:
Nombre: ${firstName} ${lastName}
Email: ${email}
Teléfono: ${phone || "No proporcionado"}
Asunto: ${subject}

MENSAJE:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de mgarquitecturauy.com
Fecha: ${new Date().toLocaleString("es-UY", { timeZone: "America/Montevideo" })}
  `

  try {
    console.log("🚀 Enviando email desde:", `contacto@mgarquitecturauy.com`)
    console.log("📧 Destinatario:", "proyectos@mgarquitecturauy.com")
    console.log("📝 Asunto:", `Consulta Web: ${subject}`)

    const { data, error } = await resend.emails.send({
      from: "Contacto MG Arquitectura <contacto@mgarquitecturauy.com>", // Tu dominio verificado
      to: "proyectos@mgarquitecturauy.com", // Tu email de destino
      subject: `Consulta Web: ${subject}`,
      reply_to: email, // Para que puedas responder directamente al cliente
      html: emailHtml, // Versión HTML del email
      text: emailText, // Versión texto plano como respaldo
    })

    if (error) {
      console.error("❌ Error al enviar email con Resend:", error)
      return {
        error: `Error al enviar el mensaje. Por favor, intenta nuevamente o contacta directamente a proyectos@mgarquitecturauy.com`,
      }
    }

    console.log("✅ Email enviado exitosamente:", data)
    return {
      success: true,
      message: "¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo en breve.",
    }
  } catch (error: any) {
    console.error("❌ Error inesperado al enviar email:", error)
    return {
      error: `Ocurrió un error inesperado. Por favor, contacta directamente a proyectos@mgarquitecturauy.com`,
    }
  }
}

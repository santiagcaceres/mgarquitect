// Funciones auxiliares para Google Analytics

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

// Función para enviar eventos personalizados
export const gtag = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag(...args)
  }
}

// Función para rastrear páginas vistas
export const pageview = (url: string) => {
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Función para rastrear eventos personalizados
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Eventos específicos para MG Arquitectura
export const trackContactFormSubmit = () => {
  event({
    action: "submit",
    category: "Contact",
    label: "Contact Form",
  })
}

export const trackProjectView = (projectTitle: string) => {
  event({
    action: "view",
    category: "Project",
    label: projectTitle,
  })
}

export const trackWhatsAppClick = () => {
  event({
    action: "click",
    category: "Contact",
    label: "WhatsApp",
  })
}

export const trackPhoneClick = () => {
  event({
    action: "click",
    category: "Contact",
    label: "Phone",
  })
}

export const trackEmailClick = () => {
  event({
    action: "click",
    category: "Contact",
    label: "Email",
  })
}

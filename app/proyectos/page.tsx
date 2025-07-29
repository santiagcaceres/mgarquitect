import type { Metadata } from "next"
import ProyectosClientPage from "./ProyectosClientPage"

// Metadata para SEO específico de la página de proyectos
export const metadata: Metadata = {
  title: "Proyectos | MG Arquitectura",
  description:
    "Explora nuestra galería completa de proyectos arquitectónicos en Uruguay. Casas modernas, oficinas corporativas, espacios comerciales y más. Diseño y construcción profesional.",
  keywords: [
    "proyectos arquitectónicos uruguay",
    "galería arquitectura",
    "casas modernas uruguay",
    "oficinas corporativas",
    "arquitectura residencial",
    "arquitectura comercial uruguay",
  ],
  openGraph: {
    title: "Proyectos | MG Arquitectura",
    description:
      "Explora nuestra galería completa de proyectos arquitectónicos en Uruguay. Diseño y construcción profesional.",
    url: "https://mgarquitectura.com/proyectos",
    images: [
      {
        url: "/images/og-image-proyectos.jpg",
        width: 1200,
        height: 630,
        alt: "Galería de Proyectos - MG Arquitectura Uruguay",
      },
    ],
  },
}

export default function ProyectosPage() {
  return <ProyectosClientPage />
}

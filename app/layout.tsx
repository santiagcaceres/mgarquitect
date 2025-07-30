import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MG Arquitectura | Desarrollo Integral de Proyectos Arquitectónicos",
  description:
    "MG Arquitectura se especializa en el desarrollo integral de proyectos arquitectónicos en Uruguay. Ofrecemos servicios de diseño residencial, comercial, instalaciones sanitarias y gestión de obras en Montevideo y todo el país.",
  keywords: [
    "arquitectura uruguay",
    "arquitecto montevideo",
    "diseño arquitectónico",
    "proyectos residenciales uruguay",
    "arquitectura comercial",
    "instalaciones sanitarias",
    "relevamiento topográfico",
    "construcción uruguay",
    "diseño de interiores",
    "mg arquitectura",
    "arquitecto profesional uruguay",
  ],
  authors: [{ name: "MG Arquitectura", url: "https://mgarquitectura.com" }],
  creator: "MG Arquitectura",
  publisher: "LaunchByte",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mgarquitectura.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MG Arquitectura | Desarrollo Integral de Proyectos Arquitectónicos",
    description:
      "Especialistas en arquitectura residencial y comercial en Uruguay. Diseño, construcción y gestión integral de proyectos arquitectónicos.",
    url: "https://mgarquitectura.com",
    siteName: "MG Arquitectura",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MG Arquitectura - Proyectos Arquitectónicos en Uruguay",
      },
    ],
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MG Arquitectura | Desarrollo Integral de Proyectos Arquitectónicos",
    description:
      "Especialistas en arquitectura residencial y comercial en Uruguay. Diseño, construcción y gestión integral de proyectos arquitectónicos.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "architecture",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MG Arquitectura",
  },
  applicationName: "MG Arquitectura",
  generator: "Next.js",
  abstract: "Desarrollo integral de proyectos arquitectónicos en Uruguay",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-UY">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "MG Arquitectura",
              description: "Desarrollo integral de proyectos arquitectónicos en Uruguay",
              url: "https://mgarquitectura.com",
              logo: "https://mgarquitectura.com/images/mg-logo.png",
              image: "https://mgarquitectura.com/images/og-image.png",
              telephone: "+59892078496",
              email: "proyectos.mgimenez@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Montevideo",
                addressCountry: "UY",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -34.9011,
                longitude: -56.1645,
              },
              areaServed: {
                "@type": "Country",
                name: "Uruguay",
              },
              serviceType: [
                "Arquitectura Residencial",
                "Arquitectura Comercial",
                "Diseño de Interiores",
                "Instalaciones Sanitarias",
                "Relevamiento Topográfico",
                "Gestión de Obras",
              ],
              founder: {
                "@type": "Person",
                name: "MG",
              },
              sameAs: ["https://wa.me/59892078496"],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" expand={true} richColors closeButton />
      </body>
    </html>
  )
}

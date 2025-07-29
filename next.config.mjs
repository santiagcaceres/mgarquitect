/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Se han añadido los dominios para Unsplash (datos de ejemplo)
    // y un placeholder para tu Supabase Storage.
    // DEBES REEMPLAZAR 'id-de-tu-proyecto' con el ID de tu proyecto de Supabase.
    // Lo encuentras en la URL de tu dashboard de Supabase.
    domains: [
      "images.unsplash.com",
      "id-de-tu-proyecto.supabase.co", // REEMPLAZAR ESTO
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig

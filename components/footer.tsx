import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center space-x-3 mb-4 md:mb-0 md:ml-8">
            <Image
              src="/images/launchbyte-logo.png"
              alt="LaunchByte"
              width={32}
              height={32}
              className="object-contain"
            />
            <div>
              <p className="text-white text-base font-semibold">LaunchByte</p>
            </div>
          </div>
          <div className="text-center md:text-right md:mr-8">
            <p className="text-gray-400 text-sm mb-1">© 2025 LaunchByte. Todos los derechos reservados.</p>
            <p className="text-gray-500 text-xs">Desarrollo web profesional</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

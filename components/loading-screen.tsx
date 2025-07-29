"use client"

import { useEffect } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete()
    }, 2500)

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/logo-loading.png"
          alt="MG Arquitectura"
          width={300}
          height={300}
          className="w-auto h-40 mb-8 animate-pulse"
          priority
        />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>

      <div className="absolute bottom-8 flex items-center gap-2">
        <span className="text-gray-400 text-xs font-medium">Powered by</span>
        <Image src="/images/launchbyte-logo.png" alt="LaunchByte" width={20} height={20} className="h-4 w-4" />
        <span className="text-gray-400 text-xs font-semibold">LaunchByte</span>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication pages for the application',
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca] via-[#4338ca]/80 to-[#4338ca]/60 opacity-40" />
      
      {/* Animated circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4338ca] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4338ca]/80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#4338ca]/60 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_0.5px,transparent_0.5px),linear-gradient(90deg,rgba(255,255,255,0.2)_0.5px,transparent_0.5px)] bg-[size:20px_20px]"
        style={{ maskImage: 'radial-gradient(black, transparent 70%)' }}
      />

      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-lg bg-white/10">
          <div className="w-full h-8 rounded-lg bg-white/20 animate-pulse" />
        </div>
      }>
        <div className="relative z-10 w-full max-w-md">{children}</div>
        <Toaster />
      </Suspense>
    </div>
  )
}


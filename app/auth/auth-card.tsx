import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface AuthCardProps {
  title: string
  children: ReactNode
}

export function AuthCard({ title, children }: AuthCardProps): JSX.Element {
  return (
    <Card className="w-full relative overflow-hidden backdrop-blur-xl bg-white border-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />
      <CardHeader className="space-y-1">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 relative animate-pulse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4338ca] to-[#4338ca]/80 animate-spin-slow" />
            <div className="absolute inset-1 rounded-full bg-[#4338ca] flex items-center justify-center">
              <Image 
                src="/logo.svg" 
                width={32} 
                height={32} 
                alt="Logo"
                className="relative z-10 transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-[#4338ca] to-[#4338ca]/80 text-transparent bg-clip-text font-bold">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">{children}</CardContent>
    </Card>
  )
}


'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoaderCircleIcon } from 'lucide-react'

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    // If you decide to re-enable redirection, uncomment the following code:
    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/login')
      }
    }, [user, loading])

    // Improved Loading State
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <LoaderCircleIcon  className="mb-4 animate-spin" size={40} />
            <p className="text-gray-600">Authenticating, please wait...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return null // You can handle this with a redirection to login or an error page if needed
    }

    return <WrappedComponent {...props} />
  }
}

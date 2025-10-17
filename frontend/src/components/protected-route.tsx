"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Páginas públicas
    const publicPaths = ['/login', '/m']
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
    
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  // Se não estiver autenticado e não for página pública, mostrar loading
  const publicPaths = ['/login', '/m']
  const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))
  
  if (!isAuthenticated && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

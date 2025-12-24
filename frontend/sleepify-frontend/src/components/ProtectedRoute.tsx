import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../Store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { checkAuth, isAuthenticated, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      await checkAuth()
      setIsLoading(false)
    }
    verify()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    )
  }

 if (!isAuthenticated) {
  return <Navigate to="/login" replace /> // ✅ GOOD: Clean redirect
}

  return <>{children}</>
}
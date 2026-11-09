import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/useAuthStore'

interface ProtectedRouteProps {
  children?: ReactNode
}


export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, accessToken } = useAuth()
  const location = useLocation()

  const hasToken = !!(accessToken || localStorage.getItem('access_token'))
  const isAuthorized = isAuthenticated && hasToken

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : null
}

export default ProtectedRoute

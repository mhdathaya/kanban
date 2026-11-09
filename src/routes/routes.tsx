import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import MyTasks from '../pages/MyTasks'
import Settings from '../pages/Settings'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../store/useAuthStore'

export const AppRouter = () => {
  const { isAuthenticated, accessToken } = useAuth()
  const isAuth = isAuthenticated && !!(accessToken || localStorage.getItem('access_token'))

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/auth/login"
        element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route
        path="*"
        element={<Navigate to={isAuth ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

export default AppRouter

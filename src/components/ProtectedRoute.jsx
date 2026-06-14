import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role } = useSelector((s) => s.auth)

  if (!user) return <Navigate to="/auth/login" replace />
  if (allowedRoles && !allowedRoles.includes(String(role)))
    return <Navigate to="/auth/login" replace />

  return children
}

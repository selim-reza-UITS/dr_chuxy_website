import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectToken } from "../features/auth/authSlice"

export function PrivateRoute({ children }) {
  const access = useSelector(selectToken)
  const location = useLocation()

  if (!access) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = ({ isAuthenticated }) => {
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

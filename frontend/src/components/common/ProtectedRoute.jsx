// src/components/common/ProtectedRoute.jsx
// Route guard matching the backend's authorize() middleware:
// - Not logged in -> redirect to /login
// - Logged in but wrong role for this route -> redirect to /dashboard
//
// Usage:
//   <Route element={<ProtectedRoute />}>            // any authenticated role
//   <Route element={<ProtectedRoute roles={["Owner"]} />}>   // Owner only
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="route-loading">Memuat...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

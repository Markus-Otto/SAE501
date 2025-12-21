import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // On attend que le context ait fini de lire le localStorage
  if (loading) return <div className="p-10 text-white">Chargement...</div>;

  // Si pas d'utilisateur, redirection login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Utilisation du ?. (optional chaining) pour plus de sécurité
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
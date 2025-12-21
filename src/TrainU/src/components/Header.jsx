import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isOnLogin = location.pathname === "/login";

  return (
    <header className="w-full border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo TrainU */}
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-semibold tracking-tight">Train</span>
          <span className="text-2xl font-semibold tracking-tight text-red-600">U</span>
        </Link>

        {/* Nav */}
       <nav className="flex items-center gap-6 text-sm">
  <Link to="/" className="...">Accueil</Link>
  <Link to="/formation" className="...">Formations</Link>

  {/* Liens dynamiques selon le rôle */}
  {user?.role === "apprenant" && (
    <Link to="/DashboardApprenant" className="text-red-500 font-bold">Mon Dashboard</Link>
  )}
  
  {user?.role === "admin" && (
    <Link to="/admin/dashboard" className="text-blue-500 font-bold">Gestion Admin</Link>
  )}

  {/* Espace connexion/déconnexion */}
  {user ? (
    <div className="flex items-center gap-3">
       <span className="text-xs text-slate-400 italic">Compte {user.role}</span>
       <button onClick={logout} className="...">Déconnexion</button>
    </div>
  ) : (
    !isOnLogin && <Link to="/login" className="...">Connexion</Link>
  )}
</nav>
      </div>
    </header>
  );
}



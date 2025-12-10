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
          <Link
            to="/"
            className="hover:text-white text-slate-300 transition"
          >
            Session
          </Link>
          <Link
            to="/"
            className="hover:text-white text-slate-300 transition"
          >
            Formation
          </Link>

          {/* Espace utilisateur */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Bonjour, <span className="font-semibold">{user.username}</span>
              </span>
              <button
                onClick={logout}
                className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-500 transition"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            !isOnLogin && (
              <Link
                to="/login"
                className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium hover:bg-red-500 transition"
              >
                Connexion
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}



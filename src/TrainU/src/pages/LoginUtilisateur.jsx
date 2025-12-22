import { useState } from "react";
// ✅ Ajout de useLocation et Link dans les imports
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginUtilisateur() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); // ✅ Ajout pour gérer l'état de chargement
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { pathname } = useLocation(); // ✅ Maintenant défini grâce à l'import
  const { login } = useAuth();

 async function handleSubmit(e) {
  e.preventDefault();
  setBusy(true);
  setError(null);
  
  try {
    // ✅ On ajoute le rôle explicitement ici
    const data = await loginRequest({ 
      email, 
      password, 
      role: "apprenant" // On force le rôle pour cette page de login
    });
    
    // Si l'API renvoie une erreur parce que c'est un admin, 
    // elle tombera directement dans le catch(err)
    
    login(data);
    navigate("/DashboardApprenant");

  } catch (err) {
    // L'erreur affichera "Accès refusé" ou "Identifiants incorrects" 
    // selon ce que ton Backend renvoie
    setError(err.message || "Identifiants incorrects");
  } finally {
    setBusy(false);
  }
}

  const buttonClass = (active) =>
    `rounded-full px-6 py-2 text-sm font-semibold transition shadow
     ${active
       ? "bg-red-700 text-white"
       : "border border-slate-600 text-slate-400 hover:bg-slate-900"
     }`;

  return (
    <div className="grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-6">
        {/* Navigation Rôles */}
        <div className="flex items-center gap-4">
          <Link to="/login" className={buttonClass(pathname === "/login")}>
            Utilisateur
          </Link>

          <Link
            to="/intervenant/login"
            className={buttonClass(pathname.includes("intervenant"))}
          >
            Intervenant
          </Link>

          <Link
            to="/admin/login"
            className={buttonClass(pathname.includes("admin"))}
          >
            Admin
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Bienvenue sur</h2>
          <h2 className="text-2xl font-semibold">
            <span className="underline decoration-red-700 text-white">TrainU</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
              placeholder="votre@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}

          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              disabled={busy}
              className="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center text-2xl text-white shadow hover:bg-red-600 disabled:opacity-50 transition"
            >
              {busy ? "..." : "→"}
            </button>

            <button 
              type="button" 
              onClick={() => window.location.href = "/signutilisateur"} 
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>

      {/* Illustration (Côté droit) */}
      <div className="hidden md:flex items-center justify-center">
        <div className="rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 w-full max-w-md aspect-[3/4] flex items-center justify-center">
          <span className="text-slate-500 text-sm italic">
            Illustration formation
          </span>
        </div>
      </div>
    </div>
  );
}
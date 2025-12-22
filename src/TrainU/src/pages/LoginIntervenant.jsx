import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginIntervenant() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { login } = useAuth();

 async function handleSubmit(e) {
  e.preventDefault();
  setBusy(true);
  try {
    // ✅ On précise que c'est une tentative de login ADMIN
    const data = await loginRequest({ email, password, role: "intervenant" });
    login(data);
    navigate("/intervenant/dashboard");
  } catch (err) {
    setError(err.message);
  } finally {
    setBusy(false);
  }
}

  const buttonClass = (active) =>
    `rounded-full px-6 py-2 text-sm font-semibold transition
     ${active
       ? "bg-red-700 text-white"
       : "border border-slate-600 text-slate-300 hover:bg-slate-900"
     }`;

  return (
    <div className="grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-6">
        {/* Navigation entre les rôles */}
        <div className="flex items-center gap-4">
          <Link to="/login" className={buttonClass(pathname === "/login")}>
            Utilisateur
          </Link>
          <Link to="/intervenant/login" className={buttonClass(pathname.includes("intervenant"))}>
            Intervenant
          </Link>
          <Link to="/admin/login" className={buttonClass(pathname.includes("admin"))}>
            Admin
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Bienvenue,</h2>
          <h2 className="text-2xl font-semibold">
            <span className="underline decoration-red-700">Intervenant</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email professionnel</label>
            <input
              type="email"
              className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600"
              placeholder="votre@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            disabled={busy}
            type="submit"
            className="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center text-white shadow hover:bg-red-600 disabled:opacity-50"
          >
            {busy ? "..." : "→"}
          </button>
        </form>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <div className="rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 w-full max-w-md aspect-[3/4] flex items-center justify-center">
          <span className="text-slate-500 text-sm">Espace Formateur</span>
        </div>
      </div>
    </div>
  );
}
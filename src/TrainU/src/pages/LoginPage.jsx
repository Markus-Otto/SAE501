import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginRequest } from "../api/auth.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");  // ✅ Renommé username → email
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      setBusy(true);  // ✅ Corrigé setLoading → setBusy

      const data = await loginRequest({ email, password });

      login(data);  // ✅ Passe l'objet complet
      navigate("/");  // ✅ Redirection après connexion
    } catch (err) {
      console.error(err);
      const msg =
        err?.message ||
        "Échec de la connexion";
      setError(msg);
    } finally {
      setBusy(false);  // ✅ Corrigé setLoading → setBusy
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-red-700 text-white px-6 py-2 text-sm font-semibold shadow">
            Utilisateur
          </button>
          <div className="w-10 h-10 rounded-full bg-red-700/70" />
          <div className="w-10 h-10 rounded-full bg-red-700/40" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Bienvenue sur</h2>
          <h2 className="text-2xl font-semibold">
            <span className="underline decoration-red-700">TrainU</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email  {/* ✅ Label changé */}
            </label>
            <input
              type="email"  
              className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600"
              value={email} 
              autoComplete="email" 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={busy}
              className="w-12 h-12 rounded-full bg-red-700 flex items-center justify-center text-2xl text-white shadow hover:bg-red-600 disabled:opacity-60"
            >
              {busy ? "..." : "→"}  {/* ✅ Indicateur de chargement */}
            </button>

            <button
              type="button"
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Créer un compte
            </button>
          </div>
        </form>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <div className="rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 w-full max-w-md aspect-[3/4] flex items-center justify-center">
          <span className="text-slate-500 text-sm">
            Image / illustration formation
          </span>
        </div>
      </div>
    </div>
  );
}

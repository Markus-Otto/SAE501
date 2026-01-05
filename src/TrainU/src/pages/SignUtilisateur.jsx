import { useState } from "react";

export default function SignUtilisateur() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmPassword: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    // Validation
    if (formData.motDePasse !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setBusy(false);
      return;
    }

    if (formData.motDePasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setBusy(false);
      return;
    }

    try {
      // Appel API pour créer l'apprenant selon le diagramme
      const response = await fetch("https://java-trainu.onrender.com/api/apprenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          motDePasse: formData.motDePasse,
          actif: true // Active/Desactive boolean du diagramme
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      // Succès
      setSuccess(true);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        confirmPassword: ""
      });
      
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Inscription réussie !</h2>
          <p className="text-slate-400">Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="w-full px-6 py-3 rounded-xl bg-red-700 text-white font-semibold shadow hover:bg-red-600 transition"
          >
            Retour à l'inscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Créer un compte</h2>
              <h2 className="text-2xl font-semibold">
                <span className="underline decoration-red-700 text-white">TrainU</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
                    placeholder="Dupont"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
                    placeholder="Jean"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Minimum 6 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:border-red-600 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={handleSubmit}
                  disabled={busy}
                  className="px-6 py-3 rounded-xl bg-red-700 text-white font-semibold shadow hover:bg-red-600 disabled:opacity-50 transition"
                >
                  {busy ? "Inscription..." : "Créer mon compte"}
                </button>

                <button 
                  type="button"
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                    onClick={() => window.location.href = "/login"}
                >
                  Déjà inscrit ? Se connecter
                </button>
              </div>
            </div>
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
      </div>
    </div>
  );
}
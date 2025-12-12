import { useEffect, useState } from "react";
import { getFormations } from "../api/formation";

export default function Formation() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFormations()
      .then(setFormations)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-400">Chargement des formations…</p>;
  }

  if (error) {
    return <p className="text-red-400">Erreur : {error}</p>;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-100">
          Nos Formations
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Découvrez nos formations professionnelles conçues pour développer
          vos compétences et répondre aux besoins réels du marché.
        </p>
      </div>

      {/* Grid des formations */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {formations.map(f => (
          <div
            key={f.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Badge actif */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {f.categorie}
              </span>
              {f.active ? (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
                  Inactive
                </span>
              )}
            </div>

            {/* Titre */}
            <h3 className="text-lg font-semibold text-slate-100">
              {f.titre}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-slate-400 line-clamp-3">
              {f.description}
            </p>

            {/* Infos */}
            <div className="mt-4 space-y-1 text-sm text-slate-300">
              <p>⏱ {f.nbHeureTotal} heures</p>
              <p>💰 {f.prix} €</p>
            </div>

            {/* CTA */}
            <button
              className="mt-6 w-full rounded-xl bg-[#EB5B5B] py-2 font-semibold text-white hover:brightness-110 transition"
            >
              Voir la formation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";

export default function FormationDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const formation = location.state?.formation;

  if (!formation) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <p className="text-red-400">Formation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Bouton retour */}
        <button 
          onClick={() => navigate(-1)}
          className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition border border-white/10"
        >
          Retour
        </button>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Contenu principal - Gauche */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-4">
                {formation.titre}
              </h1>
              
              <div className="flex gap-2 mb-6">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                  {formation.categorie}
                </span>
                {formation.active && (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Description complète */}
            <div className="space-y-4 text-slate-300">
              <p className="leading-relaxed">
                {formation.description}
              </p>

              {/* Points clés avec puces */}
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  <div>
                    <span className="font-semibold">Lorem ipsum dolor sit amet</span>
                    <span className="italic"> - consectetur adipiscing elit.</span>
                    <span className="block mt-1 text-slate-400">
                      Curabitur nec facilibus vel. In nec torquent purus, ornare blandit. Pellentesque ante pretus ornare facilisis nec luctus, blandit in eros facilibus. Ut elit duis masser rutilis. Conga. Duis sed feugilla locus. Ut viverra netus nisl. Lorem ipsum. Donec aligarum venator pulvinar. Etiam gravida sem et purs. Maecilisis justo, eleifend vel eleifend.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  <div>
                    <span className="font-semibold">et ultrices posuere cubilia curae;</span>
                    <span className="block mt-1 text-slate-400">
                      Duis sed feugilla locus. Ut viverra metus nec lorem facilisis dictum. Donec aligarum ornare pulvinar. Etiam gravida sem ut arcu tristique, quis eleifend vel eleifend. Vivamus eget nisl nisl elit. Vestibulum justo ante, blandit in tempus id.
                    </span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  <div>
                    <span className="font-semibold">laoreet vitae tortor.</span>
                    <span className="block mt-1 text-slate-400">
                      Class aptent taciti sociosqu ad libra torquent per conubia nostra, per inceptos himenaeos. Donec tempor porttitor cursus.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>


          {/* Sidebar - Droite */}
          <div className="space-y-4">
            {/* Card Durée */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-slate-400 text-sm mb-2">Durée</p>
              <p className="text-slate-100 text-3xl font-bold">
                {formation.nbHeureTotal} heures
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-slate-400 text-sm mb-2">Modèle 3d</p>
              <p className="text-slate-100 text-3xl font-bold">
                Modèle 3d de la salle
              </p>
            </div>

            {/* Card Prix */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-blue-400 text-sm mb-2 font-medium">Prix</p>
              <p className="text-slate-100 text-4xl font-bold mb-4">
                {formation.prix}€
              </p>
              <button className="w-full rounded-xl bg-[#EB5B5B] py-3 font-semibold text-white hover:brightness-110 transition">
                Acheter
              </button>
            </div>
          </div>
        </div>

        {/* Bouton S'inscrire en bas (mobile) */}
        <div className="lg:hidden">
          <button className="w-full rounded-xl bg-[#EB5B5B] py-3 font-semibold text-white hover:brightness-110 transition">
            S'inscrire à la formation
          </button>
        </div>
      </div>
    </div>
  );
}
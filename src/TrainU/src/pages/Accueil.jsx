import { Link } from "react-router-dom";

export default function Accueil() {
  return (
    <div className="text-slate-100 space-y-24">

      {/* ================= HERO ================= */}
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-20 text-center"
        style={{ backgroundColor: "#EB5B5B" }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-light tracking-wide">
            <span className="underline decoration-white underline-offset-8">
              Vos Capacités, Votre Avenir
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/90">
            TrainU accompagne votre montée en compétences grâce à des formations
            modernes, accessibles et adaptées aux besoins réels du terrain.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/connexion"
              className="rounded-full bg-slate-900 px-8 py-3 font-semibold shadow-lg hover:bg-slate-800 transition"
            >
              Rejoignez-nous
            </Link>

            <Link
              to="/formation"
              className="rounded-full border border-white/40 px-8 py-3 font-semibold hover:bg-white/10 transition"
            >
              Découvrir les formations
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRESENTATION ================= */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard
            title="Qui sommes-nous ?"
            text="TrainU est une plateforme de formation dédiée aux compétences numériques, techniques et professionnelles, pensée pour les apprenants d’aujourd’hui."
          />
          <InfoCard
            title="Notre approche"
            text="Des formations claires, progressives et concrètes, animées par des formateurs expérimentés et alignées avec les besoins du marché."
          />
          <InfoCard
            title="Nos domaines"
            text="Développement web, informatique, outils numériques, méthodes professionnelles et accompagnement à l’apprentissage."
          />
        </div>
      </section>

      {/* ================= SALLE 3D (PLACEHOLDER) ================= */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Une salle de classe interactive
              </h2>
              <p className="text-slate-300 leading-relaxed">
                TrainU intégrera prochainement une salle de classe immersive en 3D
                pour renforcer l’expérience pédagogique : visualisation, interaction
                et apprentissage dynamique.
              </p>
              <p className="mt-4 text-sm text-slate-400">
                (Cette section utilisera Three.js – structure déjà prête)
              </p>
            </div>

            {/* Placeholder Three.js */}
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10">
              <span className="text-slate-400 text-sm">
                Salle de classe 3D (à venir)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="text-center px-6">
        <h2 className="text-2xl font-semibold mb-4">
          Prêt à développer vos compétences ?
        </h2>
        <p className="text-slate-400 mb-6">
          Créez votre compte et accédez à l’ensemble des formations TrainU.
        </p>
        <Link
          to="/connexion"
          className="inline-block rounded-full bg-[#EB5B5B] px-10 py-3 font-semibold text-white shadow-lg hover:brightness-110 transition"
        >
          Commencer maintenant
        </Link>
      </section>
    </div>
  );
}

/* ========= Components ========= */

function InfoCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

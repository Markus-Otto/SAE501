import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardApprenant() {
  const { user } = useAuth();
  const [certificats, setCertificats] = useState([]);
  const [presences, setPresences] = useState([]);
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("achats");
  

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    const id = user.id;

    const urls = [
      `http://localhost:8080/api/certificats/apprenant/${id}`,
      `http://localhost:8080/api/emargement/apprenant/${id}`,
      `http://localhost:8080/api/payments/apprenant/${id}`
    ];

    try {
      const results = await Promise.allSettled(urls.map(url => fetch(url)));

      // 1. Traitement des Certificats
      if (results[0].status === "fulfilled" && results[0].value.ok) {
        const data = await results[0].value.json();
        setCertificats(data);
      }

      // 2. Traitement des Présences
      if (results[1].status === "fulfilled" && results[1].value.ok) {
        const data = await results[1].value.json();
        setPresences(data);
      }

      // 3. Traitement des Paiements
      if (results[2].status === "fulfilled" && results[2].value.ok) {
        const data = await results[2].value.json();
        setAchats(data);
      }

    } catch (error) {
      // On garde uniquement l'erreur critique en cas de crash total
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <span className="ml-4 text-xl font-medium">Chargement de votre espace...</span>
      </div>
    );
  }
  console.log("Données utilisateur actuelles :", user);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue, <span className="text-red-600">{user?.prenom} {user?.nom}</span>
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("achats")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "achats" ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Historique Achats
          </button>
          <button
            onClick={() => setActiveTab("pedagogie")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "pedagogie" ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Suivi & Certificats
          </button>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* SECTION ACHATS */}
          {activeTab === "achats" && (
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold mb-6">Vos paiements récents</h2>
              {achats.length === 0 ? (
                <div className="text-center py-10 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                  <p className="text-slate-400 italic">Aucun achat enregistré.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {achats.map((achat) => (
                    <div key={achat.id} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex justify-between items-center hover:border-slate-500 transition-colors">
                      <div>
                        <p className="font-bold text-lg">Commande #{achat.id}</p>
                        <p className="text-sm text-slate-400">
                          {new Date(achat.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{(achat.montantTotalCent / 100).toFixed(2)}€</p>
                        <span className={`mt-1 text-xs uppercase px-3 py-1 font-bold rounded-full ${
                          achat.statut === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {achat.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION PEDAGOGIE */}
          {activeTab === "pedagogie" && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Certificats */}
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-800 pb-3 text-red-500">🏆 Certificats</h3>
                <div className="space-y-4">
                  {certificats.length > 0 ? certificats.map(cert => (
                    <div key={cert.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                      <p className="font-bold text-white">{cert.formation?.titre || "Formation"}</p>
                      <p className="text-green-400 font-bold">{cert.note}/20</p>
                    </div>
                  )) : <p className="text-slate-500 italic">Aucun certificat.</p>}
                </div>
              </div>

              {/* Présences */}
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-800 pb-3 text-blue-500">📅 Présences</h3>
                <div className="space-y-3">
                  {presences.length > 0 ? presences.map(pres => (
                    <div key={pres.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex justify-between items-center">
                      <p className="font-medium">Session #{pres.sessionId || pres.id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${pres.present ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {pres.present ? "PRÉSENT" : "ABSENT"}
                      </span>
                    </div>
                  )) : <p className="text-slate-500 italic">Aucun émargement.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
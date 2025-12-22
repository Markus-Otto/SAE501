import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function DashboardApprenant() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

      if (results[0].status === "fulfilled" && results[0].value.ok) {
        setCertificats(await results[0].value.json());
      }
      if (results[1].status === "fulfilled" && results[1].value.ok) {
        setPresences(await results[1].value.json());
      }
      if (results[2].status === "fulfilled" && results[2].value.ok) {
        setAchats(await results[2].value.json());
      }
    } catch (error) {
      // Erreur silencieuse en prod
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = (certId) => {
    // Lien direct vers ton endpoint de téléchargement backend
    window.open(`http://localhost:8080/api/certificats/download/${certId}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div>
            <h1 className="text-3xl font-bold">
              Bienvenue, <span className="text-red-600">{user?.prenom} {user?.nom}</span>
            </h1>
            <p className="text-slate-400">Ravi de vous revoir sur TrainU</p>
          </div>
          <button 
            onClick={() => navigate("/profil")}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition border border-slate-700 flex items-center gap-2"
          >
            <span>⚙️</span> <span className="hidden md:inline">Paramètres</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("achats")}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${
              activeTab === "achats" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            💳 Mes Achats
          </button>
          <button
            onClick={() => setActiveTab("pedagogie")}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${
              activeTab === "pedagogie" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            🎓 Pédagogie & Diplômes
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* SECTION ACHATS */}
          {activeTab === "achats" && (
            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
              <h2 className="text-2xl font-bold mb-6">Historique des commandes</h2>
              {achats.length === 0 ? (
                <div className="text-center py-10 opacity-50 italic">Aucun achat.</div>
              ) : (
                <div className="space-y-4">
                  {achats.map((achat) => (
                    <div key={achat.id} className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="font-bold uppercase text-xs text-slate-500 mb-1">Commande #{achat.id}</p>
                        <p className="text-lg font-medium">{new Date(achat.dateCreation).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black">{(achat.montantTotalCent / 100).toFixed(2)}€</p>
                        <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-md border border-green-500/20">
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
            <div className="space-y-8">
              <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="text-yellow-500 text-3xl">🏆</span> Mes Certificats
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificats.length > 0 ? (
                    certificats.map((cert) => (
                      <div key={cert.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 group hover:border-red-600 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-red-600/10 rounded-xl text-red-500 font-black">
                            {cert.note}/20
                          </div>
                          <button 
                            onClick={() => handleDownload(cert.id)}
                            className="p-2 bg-white text-black rounded-lg hover:bg-red-600 hover:text-white transition"
                          >
                            📥
                          </button>
                        </div>
                        <h4 className="font-bold text-lg mb-1">
                          {cert.formation?.titre || cert.nomFormation || `Formation #${cert.idFormation}`}
                        </h4>
                        <p className="text-slate-500 text-xs mb-4">
                          Statut : {cert.validation === true || cert.note >= 10 ? "Validé" : "En cours / Échec"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-slate-600 italic border border-dashed border-slate-800 rounded-2xl">
                      Aucun certificat trouvé en base pour l'ID {user.id}.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-blue-500 text-3xl">📅</span> Émargements
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {presences.length > 0 ? presences.map(pres => (
                    <div key={pres.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 flex justify-between items-center">
                      <p className="font-medium text-slate-300">Session du {new Date().toLocaleDateString()}</p>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${pres.present ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {pres.present ? "PRÉSENT" : "ABSENT"}
                      </span>
                    </div>
                  )) : (
                    <p className="text-slate-500 italic">Aucun émargement enregistré.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
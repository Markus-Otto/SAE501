import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Profil from "./Profil.jsx";

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
      `http://localhost:8080/api/payments/apprenant/${id}`,

    ];

    try {
      const results = await Promise.allSettled(urls.map(url => fetch(url)));

     // Certificats
    if (results[0].status === "fulfilled" && results[0].value.ok) {
      const dataCertifs = await results[0].value.json();
      setCertificats(dataCertifs);
    }
    
    // Présences
    if (results[1].status === "fulfilled" && results[1].value.ok) {
      const dataPresences = await results[1].value.json();
      setPresences(dataPresences);
    }
    
    // Paiements (Achats)
    if (results[2].status === "fulfilled" && results[2].value.ok) {
  const dataPayments = await results[2].value.json();
  setAchats(dataPayments);
}

  } catch (error) {
    console.error("Erreur chargement:", error);
  } finally {
    setLoading(false);
  }
}

  const handleDownload = (certId) => {
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
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
                <h1 className="text-3xl font-bold">
                Dashboard <span className="text-red-600">Apprenant</span>
                </h1>
                <p className="text-slate-400">Bienvenue, {user?.prenom} {user?.nom}</p>
            </div>
           <button
                    onClick={() => setActiveTab("profil")}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition border border-slate-700 flex items-center gap-2 group"
                    >
                    <span className="hidden md:inline">Mon Profil</span>
                    </button>
                    
        </div>

        {/* Navigation Onglets */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("achats")}
            className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${
              activeTab === "achats" ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
            }`}
          >
          Mes Achats
          </button>
          <button
            onClick={() => setActiveTab("pedagogie")}
            className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${
              activeTab === "pedagogie" ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
            }`}
          >
          Pédagogie & Diplômes
          </button>
        </div>
{activeTab === "profil" && <Profil />}
        <div className="max-w-6xl mx-auto">
{/* SECTION ACHATS REGROUPÉE */}
{/* SECTION ACHATS / PAIEMENTS */}
{activeTab === "achats" && (
  <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 animate-in fade-in">
    <h2 className="text-2xl font-bold mb-8 text-white">Historique des commandes</h2>
    
    {achats.length === 0 ? (
      <div className="text-center py-20 opacity-50 italic">Aucun paiement enregistré.</div>
    ) : (
      <div className="space-y-6">
        {achats.map((payment) => {
          // On récupère les lignes de paiement (souvent nommées paymentLines en Java)
          const lignes = payment.lignes || payment.paymentLines || [];

          return (
            <div key={payment.id} className="bg-slate-800/30 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              
              {/* Header : Infos Paiement */}
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <div>
                  <p className="font-bold uppercase text-[10px] text-slate-500 tracking-widest mb-1">
                    Paiement #{payment.id}
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {payment.dateCreation ? new Date(payment.dateCreation).toLocaleDateString('fr-FR') : "Date inconnue"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">
                    {(payment.montantTotalCent / 100).toFixed(2)} €
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md border border-green-500/20 uppercase">
                    {payment.statut || "Complété"}
                  </span>
                </div>
              </div>

              {/* Détails : Infos Session récupérées depuis la table Session */}
              <div className="p-5 space-y-4">
                {lignes.length > 0 ? (
                  lignes.map((ligne, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-6 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 items-start md:items-center">
                      <div className="flex-1 space-y-2">
                        {/* Titre venant du DTO Java (formationTitre) */}
                        <h3 className="text-red-600 font-bold text-lg uppercase tracking-tight">
                          {ligne.titre || ligne.formationTitre || ligne.sessionTitre || "Titre non trouvé"}
</h3>
                        
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            <span className="text-[9px] text-slate-500 font-black">DU</span>
                            <span className="text-xs text-slate-300 font-mono">
                              {ligne.dateDebut ? new Date(ligne.dateDebut).toLocaleDateString('fr-FR') : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            <span className="text-[9px] text-slate-500 font-black">AU</span>
                            <span className="text-xs text-slate-300 font-mono">
                              {ligne.dateFin ? new Date(ligne.dateFin).toLocaleDateString('fr-FR') : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-500 text-sm italic">
                    Aucun détail de cours pour ce paiement.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
    </div>
)}

          {/* SECTION PEDAGOGIE */}
          {activeTab === "pedagogie" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Mes Certificats */}
              <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="text-yellow-500 text-3xl"></span> Mes Certificats
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificats.length > 0 ? (
                    certificats.map((cert) => (
                      <div key={cert.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 group hover:border-red-600 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl font-black ${cert.note >= 10 ? "bg-green-600/10 text-green-500" : "bg-red-600/10 text-red-500"}`}>
                            {cert.note}/20
                          </div>
                          <button 
                            onClick={() => handleDownload(cert.id)}
                            className="p-2 bg-white text-black rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-lg"
                            title="Télécharger le certificat"
                          >
                            ⬇️
                          </button>
                        </div>
                        <h4 className="font-bold text-lg mb-1 leading-tight group-hover:text-red-500 transition-colors">
                          {cert.formation?.titre || cert.nomFormation || `Formation #${cert.idFormation}`}
                        </h4>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2">
                          {cert.note >= 10 ? "Certifié TrainU" : "NON CERTIFIÉ"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-slate-600 italic border border-dashed border-slate-800 rounded-2xl">
                      Aucun certificat trouvé pour le moment.
                    </div>
                  )}
                </div>
              </div>

              {/* Mes Émargements */}
              <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">Suivi de Présence</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {presences.length > 0 ? presences.map(pres => {
                    const formationTitre = pres.session?.titre;
                    return (
                      <div key={pres.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-red-500 uppercase text-xs tracking-wider">{formationTitre}</p>
                         <p className="text-[10px] text-slate-500 font-mono uppercase">{new Date(pres.date || Date.now()).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter ${pres.present ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                        {pres.present ? "PRÉSENT" : "ABSENT"}
                      </span>
                    </div>
                  )}) : (
                    <p className="text-slate-500 italic py-4 text-center col-span-full border border-dashed border-slate-800 rounded-xl">Aucun émargement enregistré.</p>
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

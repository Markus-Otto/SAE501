import { useState, useEffect } from "react";

export default function DashboardApprenant() {
  const [apprenant, setApprenant] = useState({ nom: "Joris", prenom: "Dupont" });
  const [certificats, setCertificats] = useState([]);
  const [presences, setPresences] = useState([]);
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("achats");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Remplacez 1 par l'ID de l'apprenant connecté
      const apprenantId = 1;

      // Charger les certificats
      const certRes = await fetch(`http://localhost:8080/api/certificat/apprenant/${apprenantId}`);
      if (certRes.ok) {
        const certData = await certRes.json();
        setCertificats(certData);
      }

      // Charger les présences (émargements)
      const presRes = await fetch(`http://localhost:8080/api/emargement/apprenant/${apprenantId}`);
      if (presRes.ok) {
        const presData = await presRes.json();
        setPresences(presData);
      }

      // Charger les achats (paiements)
      const achatRes = await fetch(`http://localhost:8080/api/payments/apprenant/${apprenantId}`);
      if (achatRes.ok) {
        const achatData = await achatRes.json();
        setAchats(achatData);
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }

  const downloadCertificat = async (certificatId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/certificat/${certificatId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat_${certificatId}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue, {apprenant.prenom}
          </h1>
        </div>

        {/* Navigation tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("achats")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "achats"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Vos achats passés
          </button>
          <button
            onClick={() => setActiveTab("certificats")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "certificats"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Certificats Obtenus
          </button>
          <button
            onClick={() => setActiveTab("presences")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "presences"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Présences
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Section Achats */}
          {activeTab === "achats" && (
            <div className="lg:col-span-2 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Vos achats passés</h2>
              
              {achats.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Aucun achat pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {achats.map((achat) => (
                    <div
                      key={achat.id}
                      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-semibold text-white mb-1">
                            Paiement #{achat.id}
                          </p>
                          <p className="text-sm text-slate-400">
                            {new Date(achat.dateCreation).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-slate-300 mt-2">
                            Montant: {(achat.montantTotalCent / 100).toFixed(2)}€
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            achat.statut === "PAID"
                              ? "bg-green-500/20 text-green-400"
                              : achat.statut === "CREATED"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {achat.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Certificats */}
          {activeTab === "certificats" && (
            <div className="lg:col-span-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Certificats Obtenus</h2>
              
              {certificats.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Aucun certificat disponible</p>
              ) : (
                <div className="space-y-4">
                  {certificats.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-1">{cert.formation}</p>
                          <p className="text-sm text-slate-400">
                            Note: {cert.note}/20
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {cert.validation ? "Validé" : "Non validé"}
                          </p>
                        </div>
                        <button
                          onClick={() => downloadCertificat(cert.id)}
                          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                          title="Télécharger"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Présences */}
          {activeTab === "presences" && (
            <div className="lg:col-span-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Présences</h2>
              
              {presences.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Aucune présence enregistrée</p>
              ) : (
                <div className="space-y-4">
                  {presences.map((pres) => (
                    <div
                      key={pres.id}
                      className="bg-slate-800/50 rounded-xl p-5 border border-slate-700"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-white mb-1">
                            Session #{pres.sessionId}
                          </p>
                          <p className="text-sm text-slate-400">
                            {new Date(pres.dateSession).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pres.present
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {pres.present ? "Présent" : "Absent"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
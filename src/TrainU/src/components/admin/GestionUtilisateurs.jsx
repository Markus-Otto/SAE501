import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080";

export default function GestionUtilisateurs() {
    const [apprenants, setApprenants] = useState([]);
    const [intervenants, setIntervenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("apprenants");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [apprenantsRes, intervenantsRes] = await Promise.all([
                fetch(`${BASE_URL}/api/apprenants`),
                fetch(`${BASE_URL}/api/intervenants`)
            ]);

            if (apprenantsRes.ok) setApprenants(await apprenantsRes.json());
            if (intervenantsRes.ok) setIntervenants(await intervenantsRes.json());
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    }

    const toggleActive = async (type, id, currentStatus) => {
        const url = type === "apprenant"
            ? `${BASE_URL}/api/apprenants/${id}`
            : `${BASE_URL}/api/intervenants/${id}`;

        const user = type === "apprenant"
            ? apprenants.find(a => a.id === id)
            : intervenants.find(i => i.id === id);

        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...user,
                    active: !currentStatus,
                    motDePasse: undefined // Ne pas renvoyer le mot de passe
                })
            });

            if (res.ok) {
                await loadData();
            }
        } catch (error) {
            console.error("Erreur mise à jour:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <h2 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h2>

            {/* Navigation */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("apprenants")}
                    className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === "apprenants" ? "bg-red-600" : "bg-slate-800"
                        }`}
                >
                Apprenants ({apprenants.length})
                </button>
                <button
                    onClick={() => setActiveTab("intervenants")}
                    className={`px-6 py-3 rounded-xl font-bold transition ${activeTab === "intervenants" ? "bg-red-600" : "bg-slate-800"
                        }`}
                >
                Intervenants ({intervenants.length})
                </button>
            </div>

            {/* Liste Apprenants */}
            {activeTab === "apprenants" && (
                <div className="space-y-3">
                    {apprenants.map((apprenant) => (
                        <div
                            key={apprenant.id}
                            className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-lg">
                                    {apprenant.prenom} {apprenant.nom}
                                </h3>
                                <p className="text-slate-400 text-sm">{apprenant.email}</p>
                                <p className="text-slate-500 text-xs">{apprenant.telephone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${apprenant.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                    }`}>
                                    {apprenant.active ? "ACTIF" : "INACTIF"}
                                </span>
                                <button
                                    onClick={() => toggleActive("apprenant", apprenant.id, apprenant.active)}
                                    className={`px-4 py-2 rounded-lg font-bold transition ${apprenant.active
                                            ? "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white"
                                            : "bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white"
                                        }`}
                                >
                                    {apprenant.active ? "Désactiver" : "Activer"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Liste Intervenants */}
            {activeTab === "intervenants" && (
                <div className="space-y-3">
                    {intervenants.map((intervenant) => (
                        <div
                            key={intervenant.id}
                            className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-lg">
                                    {intervenant.prenom} {intervenant.nom}
                                </h3>
                                <p className="text-slate-400 text-sm">{intervenant.email}</p>
                                <p className="text-slate-500 text-xs">{intervenant.telephone}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${intervenant.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                    }`}>
                                    {intervenant.active ? "ACTIF" : "INACTIF"}
                                </span>
                                <button
                                    onClick={() => toggleActive("intervenant", intervenant.id, intervenant.active)}
                                    className={`px-4 py-2 rounded-lg font-bold transition ${intervenant.active
                                            ? "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white"
                                            : "bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white"
                                        }`}
                                >
                                    {intervenant.active ? "Désactiver" : "Activer"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

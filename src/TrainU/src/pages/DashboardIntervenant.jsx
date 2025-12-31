import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import FeuilleEmargement from "../components/intervenant/FeuilleEmargement.jsx";
import SaisieNotes from "../components/intervenant/SaisieNotes.jsx";
import ProfilIntervenant from "../components/intervenant/ProfilIntervenant.jsx";

export default function DashboardIntervenant() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("emargement");

    const handleLogout = () => {
        logout();
        navigate("/intervenant/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* En-tête */}
                <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Dashboard <span className="text-red-600">Intervenant</span>
                        </h1>
                        <p className="text-slate-400">Bienvenue, {user?.prenom} {user?.nom}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-3 bg-red-600 hover:bg-red-700 rounded-2xl transition border border-red-500 flex items-center gap-2"
                    >
                        <span>🚪</span> <span className="hidden md:inline">Déconnexion</span>
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-center gap-4 flex-wrap">
                    <button
                        onClick={() => setActiveTab("emargement")}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "emargement" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                    >
                        ✅ Feuille d'Émargement
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "notes" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                    >
                        📝 Saisie des Notes
                    </button>
                    <button
                        onClick={() => setActiveTab("profil")}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "profil" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                    >
                        ⚙️ Mon Profil
                    </button>
                </div>

                {/* Contenu */}
                <div className="max-w-6xl mx-auto">
                    {activeTab === "emargement" && <FeuilleEmargement />}
                    {activeTab === "notes" && <SaisieNotes />}
                    {activeTab === "profil" && <ProfilIntervenant />}
                </div>
            </div>
        </div>
    );
}

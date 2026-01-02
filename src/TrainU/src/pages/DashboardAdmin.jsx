import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import CatalogueFormation from "../components/admin/CatalogueFormation.jsx";
import GestionSessions from "../components/admin/GestionSessions.jsx";
import GestionUtilisateurs from "../components/admin/GestionUtilisateurs.jsx";

export default function DashboardAdmin() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("catalogue");

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* En-tête */}
                <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Dashboard <span className="text-red-600">Administrateur</span>
                        </h1>
                        <p className="text-slate-400">Connecté en tant que {user?.email}</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center gap-4 flex-wrap">
                    <button
                        onClick={() => setActiveTab("catalogue")}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "catalogue" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                    >
                        Catalogue de Formation
                    </button>
                    <button
                        onClick={() => setActiveTab("sessions")}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "sessions" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                    >
                        Gestion des Sessions
                    </button>
                    <button
                        onClick={() => setActiveTab("utilisateurs")}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "utilisateurs" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                    >
                        Gestion des Utilisateurs
                    </button>
                </div>

                {/* Contenu */}
                <div className="max-w-6xl mx-auto">
                    {activeTab === "catalogue" && <CatalogueFormation />}
                    {activeTab === "sessions" && <GestionSessions />}
                    {activeTab === "utilisateurs" && <GestionUtilisateurs />}
                </div>
            </div>
        </div>
    );
}

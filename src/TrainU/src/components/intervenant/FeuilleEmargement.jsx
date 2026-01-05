import { useState, useEffect } from "react";

const BASE_URL = "https://java-trainu.onrender.com";

export default function FeuilleEmargement() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [emargements, setEmargements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSessions();
    }, []);

    async function loadSessions() {
        try {
            const res = await fetch(`${BASE_URL}/api/session`);
            if (res.ok) {
                const data = await res.json();
                // Filtrer les sessions du jour (vous pouvez ajuster selon vos besoins)
                setSessions(data);
            }
        } catch (error) {
            console.error("Erreur chargement sessions:", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadEmargements(sessionId) {
        try {
            const res = await fetch(`${BASE_URL}/api/emargement/session/${sessionId}`);
            if (res.ok) {
                setEmargements(await res.json());
            }
        } catch (error) {
            console.error("Erreur chargement émargements:", error);
        }
    }

    const handleSessionSelect = async (session) => {
        setSelectedSession(session);
        await loadEmargements(session.id);
    };

    const togglePresence = async (emargementId, currentStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/api/emargement/${emargementId}?present=${!currentStatus}`, {
                method: "PUT"
            });

            if (res.ok) {
                await loadEmargements(selectedSession.id);
            }
        } catch (error) {
            console.error("Erreur mise à jour présence:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <h2 className="text-2xl font-bold mb-6">Feuille d'Émargement</h2>

            {!selectedSession ? (
                <div>
                    <h3 className="font-bold mb-4">Sélectionnez une session :</h3>
                    <div className="space-y-3">
                        {sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => handleSessionSelect(session)}
                                className="w-full text-left bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-red-600 transition"
                            >
                                <h4 className="font-bold text-lg mb-2">{session.titre}</h4>
                                <div className="text-sm text-slate-400 space-y-1">
                                    <p>{new Date(session.dateDebut).toLocaleDateString()} - {new Date(session.dateFin).toLocaleDateString()}</p>
                                    <p>Salle: {session.salle || "Non définie"}</p>
                                    <p>{session.nombreParticipants || 0} participants</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-xl">{selectedSession.titre}</h3>
                            <p className="text-slate-400">
                                {new Date(selectedSession.dateDebut).toLocaleDateString()} - Salle {selectedSession.salle}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedSession(null);
                                setEmargements([]);
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                        >
                            ← Retour
                        </button>
                    </div>

                    <div className="space-y-3">
                        {emargements.length > 0 ? (
                            emargements.map((emargement) => (
                                <div
                                    key={emargement.id}
                                    className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex justify-between items-center"
                                >
                                    <div>
                                        <h4 className="font-bold">
                                            {emargement.apprenant?.prenom || "Prénom"} {emargement.apprenant?.nom || "Nom"}
                                        </h4>
                                        <p className="text-slate-400 text-sm">{emargement.apprenant?.email || "email@example.com"}</p>
                                    </div>
                                    <button
                                        onClick={() => togglePresence(emargement.id, emargement.present)}
                                        className={`px-6 py-3 rounded-xl font-bold transition ${emargement.present
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white"
                                            }`}
                                    >
                                        {emargement.present ? "✓ PRÉSENT" : "✗ ABSENT"}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 italic py-10">
                                Aucun émargement pour cette session
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

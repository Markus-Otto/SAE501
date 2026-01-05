import { useState, useEffect } from "react";

const BASE_URL = "https://java-trainu.onrender.com";

export default function GestionSessions() {
    const [sessions, setSessions] = useState([]);
    const [formations, setFormations] = useState([]);
    const [intervenants, setIntervenants] = useState([]);
    const [inscriptions, setInscriptions] = useState([]);
    const [apprenants, setApprenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showInscriptionModal, setShowInscriptionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [editingSession, setEditingSession] = useState(null);
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        categorie: "",
        dateDebut: "",
        dateFin: "",
        nombrePoste: "",
        salle: "",
        formation: { id: "" },
        intervenant: { id: "" }
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [sessionsRes, formationsRes, intervenantsRes, apprenantsRes] = await Promise.all([
                fetch(`${BASE_URL}/api/session`),
                fetch(`${BASE_URL}/api/formation`),
                fetch(`${BASE_URL}/api/intervenants`),
                fetch(`${BASE_URL}/api/apprenants`)
            ]);

            if (sessionsRes.ok) setSessions(await sessionsRes.json());
            if (formationsRes.ok) setFormations(await formationsRes.json());
            if (intervenantsRes.ok) setIntervenants(await intervenantsRes.json());
            if (apprenantsRes.ok) setApprenants(await apprenantsRes.json());
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadInscriptions(sessionId) {
        try {
            const res = await fetch(`${BASE_URL}/api/inscriptions`);
            if (res.ok) {
                const allInscriptions = await res.json();
                setInscriptions(allInscriptions.filter(i => i.session?.id === sessionId));
            }
        } catch (error) {
            console.error("Erreur chargement inscriptions:", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formationId = formData.formation.id;
        const url = editingSession
            ? `${BASE_URL}/api/session/${editingSession.id}`
            : `${BASE_URL}/api/session/${formationId}`;

        const method = editingSession ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    nombrePoste: parseInt(formData.nombrePoste),
                    nombreParticipants: editingSession?.nombreParticipants || 0
                })
            });

            if (res.ok) {
                await loadData();
                closeModal();
            }
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Supprimer cette session ?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/session/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                await loadData();
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    };

    const handleInscrire = async (apprenantId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/inscriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apprenant: { id: apprenantId },
                    session: { id: selectedSession.id },
                    prixCent: selectedSession.formation?.prix * 100 || 0,
                    statut: "CONFIRMEE"
                })
            });

            if (res.ok) {
                await loadInscriptions(selectedSession.id);
            }
        } catch (error) {
            console.error("Erreur inscription:", error);
        }
    };

    const handleDesinscrire = async (inscriptionId) => {
        if (!confirm("Désinscrire cet apprenant ?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/inscriptions/${inscriptionId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                await loadInscriptions(selectedSession.id);
            }
        } catch (error) {
            console.error("Erreur désinscription:", error);
        }
    };

    const openModal = (session = null) => {
        if (session) {
            setEditingSession(session);
            setFormData({
                titre: session.titre,
                description: session.description,
                categorie: session.categorie,
                dateDebut: session.dateDebut?.slice(0, 16) || "",
                dateFin: session.dateFin?.slice(0, 16) || "",
                nombrePoste: session.nombrePoste,
                salle: session.salle || "",
                formation: { id: session.formation?.id || "" },
                intervenant: { id: session.intervenant?.id || "" }
            });
        } else {
            setEditingSession(null);
            setFormData({
                titre: "",
                description: "",
                categorie: "",
                dateDebut: "",
                dateFin: "",
                nombrePoste: "",
                salle: "",
                formation: { id: "" },
                intervenant: { id: "" }
            });
        }
        setShowModal(true);
    };

    const openInscriptionModal = async (session) => {
        setSelectedSession(session);
        await loadInscriptions(session.id);
        setShowInscriptionModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSession(null);
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestion des Sessions</h2>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl font-bold transition"
                >
                Nouvelle Session
                </button>
            </div>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-red-600 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2">{session.titre}</h3>
                                <p className="text-slate-400 text-sm mb-3">{session.description}</p>

                                <div className="grid md:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Formation:</span>
                                        <span className="text-white">{session.formation?.titre || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Intervenant:</span>
                                        <span className="text-white">
                                            {session.intervenant ? `${session.intervenant.prenom} ${session.intervenant.nom}` : "Non assigné"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Début:</span>
                                        <span className="text-white">{new Date(session.dateDebut).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Fin:</span>
                                        <span className="text-white">{new Date(session.dateFin).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Salle:</span>
                                        <span className="text-white">{session.salle || "Non définie"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">Places:</span>
                                        <span className="text-white">{session.nombreParticipants || 0}/{session.nombrePoste}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openInscriptionModal(session)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-bold"
                            >
                            Gérer Inscriptions
                            </button>
                            <button
                                onClick={() => openModal(session)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm font-bold"
                            >
                            Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(session.id)}
                                className="px-4 py-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition text-sm font-bold"
                            >
                            Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Session */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">
                            {editingSession ? "Modifier la session" : "Nouvelle session"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Titre</label>
                                <input
                                    type="text"
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                    className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none h-24"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Formation</label>
                                    <select
                                        value={formData.formation.id}
                                        onChange={(e) => setFormData({ ...formData, formation: { id: e.target.value } })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {formations.map(f => (
                                            <option key={f.id} value={f.id}>{f.titre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Intervenant</label>
                                    <select
                                        value={formData.intervenant.id}
                                        onChange={(e) => setFormData({ ...formData, intervenant: { id: e.target.value } })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {intervenants.map(i => (
                                            <option key={i.id} value={i.id}>{i.prenom} {i.nom}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Date début</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.dateDebut}
                                        onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Date fin</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.dateFin}
                                        onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Salle</label>
                                    <input
                                        type="text"
                                        value={formData.salle}
                                        onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Catégorie</label>
                                    <input
                                        type="text"
                                        value={formData.categorie}
                                        onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Nombre de places</label>
                                    <input
                                        type="number"
                                        value={formData.nombrePoste}
                                        onChange={(e) => setFormData({ ...formData, nombrePoste: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition"
                                >
                                    {editingSession ? "Mettre à jour" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Inscriptions */}
            {showInscriptionModal && selectedSession && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">
                            Gérer les inscriptions - {selectedSession.titre}
                        </h3>

                        <div className="mb-6">
                            <h4 className="font-bold mb-3">Apprenants inscrits ({inscriptions.length})</h4>
                            <div className="space-y-2">
                                {inscriptions.map((inscription) => (
                                    <div key={inscription.id} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl">
                                        <span>{inscription.apprenant?.prenom} {inscription.apprenant?.nom}</span>
                                        <button
                                            onClick={() => handleDesinscrire(inscription.id)}
                                            className="px-4 py-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition text-sm font-bold"
                                        >
                                            Désinscrire
                                        </button>
                                    </div>
                                ))}
                                {inscriptions.length === 0 && (
                                    <p className="text-slate-500 italic">Aucun apprenant inscrit</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-3">Inscrire un apprenant</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {apprenants
                                    .filter(a => !inscriptions.some(i => i.apprenant?.id === a.id))
                                    .map((apprenant) => (
                                        <div key={apprenant.id} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl">
                                            <span>{apprenant.prenom} {apprenant.nom} ({apprenant.email})</span>
                                            <button
                                                onClick={() => handleInscrire(apprenant.id)}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm font-bold"
                                            >
                                                Inscrire
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInscriptionModal(false)}
                            className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

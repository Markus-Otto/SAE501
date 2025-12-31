import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080";

export default function SaisieNotes() {
    const [formations, setFormations] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [apprenants, setApprenants] = useState([]);
    const [notes, setNotes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFormations();
    }, []);

    async function loadFormations() {
        try {
            const res = await fetch(`${BASE_URL}/api/formation`);
            if (res.ok) {
                setFormations(await res.json());
            }
        } catch (error) {
            console.error("Erreur chargement formations:", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadApprenants(formationId) {
        try {
            // Récupérer tous les apprenants (vous pouvez filtrer selon vos besoins)
            const res = await fetch(`${BASE_URL}/api/apprenants`);
            if (res.ok) {
                setApprenants(await res.json());
            }
        } catch (error) {
            console.error("Erreur chargement apprenants:", error);
        }
    }

    const handleFormationSelect = async (formation) => {
        setSelectedFormation(formation);
        await loadApprenants(formation.id);
    };

    const handleNoteChange = (apprenantId, value) => {
        const note = parseInt(value);
        if (note >= 0 && note <= 20) {
            setNotes({ ...notes, [apprenantId]: note });
        }
    };

    const handleSubmit = async (apprenantId) => {
        const note = notes[apprenantId];
        if (note === undefined || note === null) {
            alert("Veuillez saisir une note");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/certificats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idFormation: selectedFormation.id,
                    idApprenant: apprenantId,
                    note: note
                })
            });

            if (res.ok) {
                alert(`Certificat créé ! ${note >= 10 ? "Formation validée ✓" : "Formation non validée"}`);
                // Réinitialiser la note
                const newNotes = { ...notes };
                delete newNotes[apprenantId];
                setNotes(newNotes);
            }
        } catch (error) {
            console.error("Erreur création certificat:", error);
            alert("Erreur lors de la création du certificat");
        }
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <h2 className="text-2xl font-bold mb-6">Saisie des Notes</h2>

            {!selectedFormation ? (
                <div>
                    <h3 className="font-bold mb-4">Sélectionnez une formation :</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formations.map((formation) => (
                            <button
                                key={formation.id}
                                onClick={() => handleFormationSelect(formation)}
                                className="text-left bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-red-600 transition"
                            >
                                <h4 className="font-bold text-lg mb-2">{formation.titre}</h4>
                                <p className="text-slate-400 text-sm mb-2">{formation.categorie}</p>
                                <p className="text-slate-500 text-xs">{formation.nbHeureTotal}h - {formation.prix}€</p>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-xl">{selectedFormation.titre}</h3>
                            <p className="text-slate-400">{selectedFormation.categorie}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedFormation(null);
                                setApprenants([]);
                                setNotes({});
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                        >
                            ← Retour
                        </button>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                        <p className="text-yellow-500 text-sm">
                            ℹ️ <strong>Note importante :</strong> Si la note est ≥ 10, le certificat sera automatiquement validé.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {apprenants.map((apprenant) => (
                            <div
                                key={apprenant.id}
                                className="bg-slate-800/50 p-5 rounded-xl border border-slate-700"
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold">
                                            {apprenant.prenom} {apprenant.nom}
                                        </h4>
                                        <p className="text-slate-400 text-sm">{apprenant.email}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-bold">Note :</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                value={notes[apprenant.id] || ""}
                                                onChange={(e) => handleNoteChange(apprenant.id, e.target.value)}
                                                className="w-20 p-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-red-600 outline-none text-center font-bold"
                                                placeholder="0-20"
                                            />
                                            <span className="text-slate-500">/ 20</span>
                                        </div>

                                        <button
                                            onClick={() => handleSubmit(apprenant.id)}
                                            disabled={!notes[apprenant.id] && notes[apprenant.id] !== 0}
                                            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-bold transition"
                                        >
                                            Valider
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080";

export default function CatalogueFormation() {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFormation, setEditingFormation] = useState(null);
    const [formData, setFormData] = useState({
        titre: "",
        description: "",
        categorie: "",
        nbHeureTotal: "",
        prix: "",
        active: true
    });

    useEffect(() => {
        loadFormations();
    }, []);

    async function loadFormations() {
        try {
            const res = await fetch(`${BASE_URL}/api/formation`);
            if (res.ok) {
                const data = await res.json();
                setFormations(data);
            }
        } catch (error) {
            console.error("Erreur chargement formations:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingFormation
            ? `${BASE_URL}/api/formation/${editingFormation.id}`
            : `${BASE_URL}/api/formation`;

        const method = editingFormation ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    nbHeureTotal: parseInt(formData.nbHeureTotal),
                    prix: parseInt(formData.prix)
                })
            });

            if (res.ok) {
                await loadFormations();
                closeModal();
            }
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Supprimer cette formation ?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/formation/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                await loadFormations();
            }
        } catch (error) {
            console.error("Erreur suppression:", error);
        }
    };

    const openModal = (formation = null) => {
        if (formation) {
            setEditingFormation(formation);
            setFormData(formation);
        } else {
            setEditingFormation(null);
            setFormData({
                titre: "",
                description: "",
                categorie: "",
                nbHeureTotal: "",
                prix: "",
                active: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFormation(null);
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Catalogue de Formation</h2>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl font-bold transition"
                >
                    ➕ Nouvelle Formation
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formations.map((formation) => (
                    <div
                        key={formation.id}
                        className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-red-600 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${formation.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                }`}>
                                {formation.active ? "ACTIF" : "INACTIF"}
                            </span>
                            <span className="text-2xl font-black text-red-500">{formation.prix}€</span>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{formation.titre}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{formation.description}</p>

                        <div className="flex gap-2 text-xs text-slate-500 mb-4">
                            <span>📚 {formation.categorie}</span>
                            <span>⏱️ {formation.nbHeureTotal}h</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openModal(formation)}
                                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm font-bold"
                            >
                                ✏️ Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(formation.id)}
                                className="flex-1 py-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition text-sm font-bold"
                            >
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-6">
                            {editingFormation ? "Modifier la formation" : "Nouvelle formation"}
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
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Catégorie</label>
                                    <input
                                        type="text"
                                        value={formData.categorie}
                                        onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Nb heures total</label>
                                    <input
                                        type="number"
                                        value={formData.nbHeureTotal}
                                        onChange={(e) => setFormData({ ...formData, nbHeureTotal: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Prix (€)</label>
                                    <input
                                        type="number"
                                        value={formData.prix}
                                        onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Statut</label>
                                    <select
                                        value={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
                                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                                    >
                                        <option value="true">Actif</option>
                                        <option value="false">Inactif</option>
                                    </select>
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
                                    {editingFormation ? "Mettre à jour" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const BASE_URL = "https://java-trainu.onrender.com";

export default function ProfilIntervenant() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motDePasse: ""
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user?.id) {
            loadProfil();
        }
    }, [user]);

    async function loadProfil() {
        try {
            const res = await fetch(`${BASE_URL}/api/intervenants/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    telephone: data.telephone,
                    motDePasse: ""
                });
            }
        } catch (error) {
            console.error("Erreur chargement profil:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = { ...formData };
            // Si le mot de passe est vide, ne pas l'envoyer
            if (!dataToSend.motDePasse) {
                delete dataToSend.motDePasse;
            }

            const res = await fetch(`${BASE_URL}/api/intervenants/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
                setFormData({ ...formData, motDePasse: "" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
            }
        } catch (error) {
            console.error("Erreur mise à jour:", error);
            setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
        }
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>

            {message && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === "success"
                        ? "bg-green-500/20 border border-green-500/30 text-green-400"
                        : "bg-red-500/20 border border-red-500/30 text-red-400"
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Prénom</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Nom</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Téléphone</label>
                    <input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">
                        Nouveau mot de passe <span className="text-slate-500 font-normal">(laisser vide pour ne pas changer)</span>
                    </label>
                    <input
                        type="password"
                        value={formData.motDePasse}
                        onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                        className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 focus:border-red-600 outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition mt-6"
                >
                    Mettre à jour le profil
                </button>
            </form>
        </div>
    );
}

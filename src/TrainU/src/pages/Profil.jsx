import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profil() {
  const { user, login } = useAuth(); // login permet de rafraîchir le localStorage
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    password: "" // On ne l'affiche pas pour la sécurité
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/apprenants/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Mise à jour du contexte global
        login({ ...updatedUser, token: localStorage.getItem("trainu_token") }); 
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-8">Paramètres du profil</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Prénom</label>
              <input type="text" value={formData.prenom} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
                onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Nom</label>
              <input type="text" value={formData.nom} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
                onChange={(e) => setFormData({...formData, nom: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <input type="email" value={formData.email} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Nouveau mot de passe (laisser vide si inchangé)</label>
            <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl ${message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition">
            Sauvegarder les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
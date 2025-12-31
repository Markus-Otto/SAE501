import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom"; // Import manquant

export default function Profil() {
  const { user, login } = useAuth();
  const navigate = useNavigate(); // Définition du hook de navigation
  
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    password: "" 
  });
  
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // On ne veut pas envoyer un mot de passe vide au backend
    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;

    try {
      const response = await fetch(`http://localhost:8080/api/apprenants/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Mise à jour du contexte pour que le nom change partout (header, etc.)
        login({ ...updatedUser, token: localStorage.getItem("trainu_token") }); 
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      } else {
        setMessage({ type: "error", text: "Erreur lors de la mise à jour." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connexion au serveur impossible." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Bouton Retour corrigé */}
      <div className="max-w-2xl mx-auto mb-6">
        <button 
          onClick={() => navigate("/DashboardApprenant")}
          className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition border border-white/10"
        >
          ← Retour au Dashboard
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Paramètres du profil
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Prénom</label>
              <input 
                type="text" 
                value={formData.prenom} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none transition"
                onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Nom</label>
              <input 
                type="text" 
                value={formData.nom} 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none transition"
                onChange={(e) => setFormData({...formData, nom: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email professionnel</label>
            <input 
              type="email" 
              value={formData.email} 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Nouveau mot de passe</label>
            <input 
              type="password" 
              placeholder="Laisser vide pour ne pas modifier" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl  ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition shadow-lg shadow-red-900/20">
            Sauvegarder les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SessionSelection() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const formation = location.state?.formation;

  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date(2025, 10, 1));
  
  // Changement ici : on utilise un tableau pour autoriser plusieurs sélections
  const [selectedSessions, setSelectedSessions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/session/formation/${id}/sessions`)
      .then((res) => res.json())
      .then((data) => {
        setAllSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const filteredSessions = useMemo(() => {
    return allSessions.filter(session => {
      const d = new Date(session.dateDebut);
      return d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
    });
  }, [allSessions, viewDate]);

  // Fonction pour gérer la sélection multiple avec contrainte de date
  const toggleSession = (session) => {
    const sessionDate = new Date(session.dateDebut).toDateString();
    
    // 1. Si la session est déjà sélectionnée, on la retire
    if (selectedSessions.find(s => s.id === session.id)) {
      setSelectedSessions(selectedSessions.filter(s => s.id !== session.id));
      return;
    }

    // 2. Vérifier si une session est déjà sélectionnée pour ce jour-là
    const hasSessionSameDay = selectedSessions.some(
      s => new Date(s.dateDebut).toDateString() === sessionDate
    );

    if (hasSessionSameDay) {
      alert("Vous avez déjà choisi une session pour cette journée !");
      return;
    }

    // 3. Sinon, on l'ajoute à la liste
    setSelectedSessions([...selectedSessions, session]);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  if (!formation) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <button onClick={() => navigate(-1)} className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition border border-white/10">
          Retour
        </button>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col min-h-[500px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-100 mb-2 uppercase tracking-wide">Choix des sessions</h1>
              <p className="text-slate-400 text-sm italic">Plusieurs choix possibles (1 max par jour)</p>
            </div>

            <div className="space-y-3">
              {filteredSessions.map((session) => {
                const isSelected = selectedSessions.find(s => s.id === session.id);
                return (
                  <div
                  key={session.id}
                  onClick={() => toggleSession(session)}
                  className={`group cursor-pointer p-5 rounded-xl border transition-all flex justify-between items-center
                    ${isSelected 
                    ? "bg-[#EB5B5B] border-[#EB5B5B] text-white" 
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}`}
                  >
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-white/60 mb-1">Date</span>
                    <span className="font-semibold">
                    {new Date(session.dateDebut).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                    {" à " + new Date(session.dateDebut).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {" - " + new Date(session.dateFin).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    </span>
                  </div>
                  {isSelected && <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">SÉLECTIONNÉE</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="flex flex-col gap-2">
                <button onClick={() => changeMonth(-1)} className="text-slate-500 hover:text-white text-sm">Précédent</button>
                <div className="py-3 px-4 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-slate-100 text-xl font-bold capitalize">{viewDate.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'})}</span>
                </div>
                <button onClick={() => changeMonth(1)} className="text-slate-500 hover:text-white text-sm">Suivant</button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
               <p className="text-blue-400 text-xs font-bold uppercase mb-2">Récapitulatif</p>
               <p className="text-slate-100 font-bold">{selectedSessions.length} session(s) sélectionnée(s)</p>
               <p className="text-slate-400 text-2xl font-bold">{formation.prix * selectedSessions.length}€</p>
            </div>

            <button
              disabled={selectedSessions.length === 0}
              onClick={() => navigate("/paiement", { state: { formation, sessions: selectedSessions } })}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${selectedSessions.length > 0 ? "bg-[#EB5B5B] hover:brightness-110" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
            >
              Passer au paiement ({selectedSessions.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
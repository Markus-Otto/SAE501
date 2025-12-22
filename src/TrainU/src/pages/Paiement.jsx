import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPayment, syncPayment } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx"; // ✅ Importé

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function PaymentForm({ formation, sessions, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth(); // ✅ On récupère l'user connecté
  
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState(user?.email || ""); 
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // ✅ L'ID est maintenant celui de l'utilisateur (ex: 21)
  const apprenantId = user?.id; 

  const total = useMemo(() => formation.prix * sessions.length, [formation, sessions]);

  const handlePayment = async () => {
    if (!stripe || !elements || !cardholderName) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setBusy(true);
      setError(null);

      const lignes = sessions.map(session => ({
        inscriptionId: session.id,
        montantCent: formation.prix * 100 
      }));

      // ✅ Envoi de l'ID dynamique au backend
      const paymentData = await createPayment({
        apprenantId,  
        email: email || user?.email,
        lignes  
      });

      const { error: stripeError } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: cardholderName,
              email: email || user?.email
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      await syncPayment(paymentData.paiementId);
      alert("Paiement réussi !");
      onBack();
      
    } catch (err) {
      setError(err.message || "Erreur lors du paiement");
    } finally {
      setBusy(false);
    }
  };
  return (
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 rounded-xl bg-[#1a1f35] px-6 py-3 text-sm font-medium text-white hover:bg-[#252b45] transition border border-white/10"
        >
          Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulaire de paiement */}
          <div className="rounded-3xl border border-white/10 bg-[#141827] p-10">
            <h2 className="text-3xl font-bold text-white mb-8">Information de Paiement</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm mb-3 font-medium">Nom sur la carte</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full bg-[#1a1f35] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#ef5a5a] transition text-base"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-3 font-medium">Numéro de carte</label>
                <div className="bg-[#1a1f35] border border-white/10 rounded-2xl px-5 py-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          color: '#fff',
                          fontSize: '16px',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          '::placeholder': { color: 'rgba(255,255,255,0.3)' }
                        },
                        invalid: {
                          color: '#ef5a5a'
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-3 font-medium">Email (optionnel)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1f35] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#ef5a5a] transition text-base"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={!stripe || busy}
                className="w-full bg-[#434959] hover:bg-[#535968] disabled:bg-[#2a2e3d] disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 mt-8"
              >
                <span>{busy ? "Traitement..." : "Confirmer le paiement"}</span>
                {!busy && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Résumé d'achat */}
          <div className="rounded-3xl border border-white/10 bg-[#141827] p-10 flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-8">Résumé d'achat</h2>
            
            <div className="space-y-4 flex-grow">
              {sessions.map((session) => (
                <div key={session.id} className="pb-5 border-b border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white/60 text-sm mb-2">
                        {new Date(session.dateDebut).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                        {" - Salle " + (session.salle || "TBD")}
                        {" - " + new Date(session.dateDebut).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className="text-[#ef5a5a] font-bold text-2xl ml-4">
                      {formation.prix}€
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 mt-8 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-2xl font-semibold">Total:</span>
                <span className="text-[#ef5a5a] text-5xl font-bold">{total}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formation, sessions } = location.state || {};

  if (!formation || !sessions) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <p className="text-white">Données manquantes</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        formation={formation} 
        sessions={sessions}
        onBack={() => navigate(-1)}
      />
    </Elements>
  );
}
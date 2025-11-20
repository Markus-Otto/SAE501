import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPayment, listPayments, cancelPayment, refundPayment } from "./api/api.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

function currencyCents(c) {
  return (c / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function SessionPicker({ onAdd }) {
  const [name, setName] = useState("");
  const [priceEu, setPriceEu] = useState("");

  const add = () => {
    const price = Math.round(parseFloat(priceEu.replace(",", ".")) * 100);
    if (!name || !price || price <= 0) return;
    onAdd({ label: name, montantCent: price, inscriptionId: Date.now() % 1e7 });
    setName(""); setPriceEu("");
  };

  return (
    <div className="card">
      <h3>Ajouter une session</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder="Nom" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Prix (€)" value={priceEu} onChange={e => setPriceEu(e.target.value)} />
        <button onClick={add}>Ajouter</button>
      </div>
      <p style={{ opacity:.7, marginTop:4 }}>Astuce : tu peux saisir autant de lignes que tu veux.</p>
    </div>
  );
}

function Cart({ lignes, onRemove }) {
  const total = useMemo(() => lignes.reduce((s, l) => s + l.montantCent, 0), [lignes]);
  return (
    <div className="card">
      <h3>Panier</h3>
      {lignes.length === 0 ? <em>Vide</em> : (
        <ul>
          {lignes.map(l => (
            <li key={l.inscriptionId} style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
              <span>{l.label}</span>
              <span>{currencyCents(l.montantCent)} <button onClick={() => onRemove(l.inscriptionId)}>Suppr</button></span>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop:8, fontWeight:700 }}>Total : {currencyCents(total)}</div>
    </div>
  );
}

function PayForm({ lignes, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("test@example.com");
  const [apprenantId, setApprenantId] = useState(1);
  const total = useMemo(() => lignes.reduce((s, l) => s + l.montantCent, 0), [lignes]);
  const [log, setLog] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    if (lignes.length === 0) return;

    try {
      setBusy(true); setLog(null);
      // 1) Créer l'intent côté API (on envoie seulement les lignes)
      const r = await createPayment({
        apprenantId: Number(apprenantId),
        email,
        lignes: lignes.map(l => ({ inscriptionId: l.inscriptionId, montantCent: l.montantCent }))
      });

      // 2) Confirmer avec la carte côté client
      const { error, paymentIntent } = await stripe.confirmCardPayment(r.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email }
        }
      });

      if (error) {
        setLog({ type:"error", error });
        onPaid?.(null, r, error);
        return;
      }
      setLog({ type:"ok", paymentIntent, api: r });
      onPaid?.(paymentIntent, r, null);
      elements.getElement(CardElement)?.clear();
    } catch (e) {
      setLog({ type:"error", error: e });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>Paiement</h3>
      <div style={{ display:"grid", gap:8, maxWidth:460 }}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={apprenantId} onChange={e=>setApprenantId(e.target.value)} placeholder="Apprenant ID" />
        <CardElement options={{ hidePostalCode:true }} />
        <button disabled={!stripe || busy || total<=0} onClick={handlePay}>
          Payer {total>0 ? `(${currencyCents(total)})` : ""}
        </button>
      </div>
      {log && (
        <pre className={`log ${log.type}`}>{JSON.stringify(log, null, 2)}</pre>
      )}
    </div>
  );
}

function PaymentsTable() {
  const [items, setItems] = useState([]);
  const [onlyPending, setOnlyPending] = useState(false);
  const [busyId, setBusyId] = useState(null);

  async function reload() {
    const data = await listPayments();
    setItems(data);
  }
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    if (!onlyPending) return items;
    return items.filter(p => p.statut === "CREATED");
  }, [items, onlyPending]);

  async function onCancel(id) {
    setBusyId(id);
    try {
      await cancelPayment(id);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  async function onRefund(id) {
    setBusyId(id);
    try {
      await refundPayment(id, "UI refund");
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h3>Historique des paiements</h3>
        <label style={{ display:"flex", gap:8 }}>
          <input type="checkbox" checked={onlyPending} onChange={e=>setOnlyPending(e.target.checked)} />
          N’afficher que les “en attente”
        </label>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th><th>Apprenant</th><th>Montant</th><th>Statut</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.apprenantId}</td>
              <td>{currencyCents(p.montantTotalCent)}</td>
              <td>{p.statut}</td>
              <td>{new Date(p.dateCreation).toLocaleString()}</td>
              <td style={{ display:"flex", gap:8 }}>
                {p.statut === "CREATED" && (
                  <button disabled={busyId===p.id} onClick={()=>onCancel(p.id)}>Annuler</button>
                )}
                {p.statut === "PAID" && (
                  <button disabled={busyId===p.id} onClick={()=>onRefund(p.id)}>Rembourser</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={reload} style={{ marginTop:8 }}>Rafraîchir</button>
    </div>
  );
}

function AppInner() {
  const [lignes, setLignes] = useState([
    { inscriptionId: 10, label: "Session A", montantCent: 5000 },
    { inscriptionId: 11, label: "Session B", montantCent: 2500 },
  ]);

  return (
    <div className="wrap">
      <h2>TrainU — Paiements</h2>
      <div className="grid">
        <SessionPicker onAdd={l => setLignes(prev => [...prev, l])} />
        <Cart
          lignes={lignes}
          onRemove={(id) => setLignes(prev => prev.filter(l => l.inscriptionId !== id))}
        />
        <PayForm
          lignes={lignes}
          onPaid={() => setLignes([])}
        />
        <PaymentsTable />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Elements stripe={stripePromise}>
      <AppInner />
    </Elements>
  );
}

/* mini styles (optionnel) */
const style = document.createElement("style");
style.textContent = `
  .wrap{max-width:1100px;margin:24px auto;padding:0 12px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
  .card{background:#111;border:1px solid #222;padding:14px;border-radius:12px}
  .table{width:100%;border-collapse:collapse;margin-top:8px}
  .table th,.table td{border-bottom:1px solid #222;padding:8px;text-align:left}
  input{background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:8px;color:#fff}
  button{padding:8px 12px;border:1px solid #333;background:#1a1a1a;border-radius:8px;cursor:pointer}
  button:disabled{opacity:.6;cursor:not-allowed}
  .log{white-space:pre-wrap; background:#0b0b0b; border:1px solid #222; padding:8px; border-radius:8px; margin-top:8px}
  .log.error{border-color:#5a1f1f}
`;
document.head.appendChild(style);

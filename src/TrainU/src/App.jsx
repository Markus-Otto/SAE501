import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPayment, listPayments, cancelPayment, refundPayment, syncPayment } from "./api/api.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// --- helpers ---
function currencyCents(c) {
  return (c / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

// --- UI blocks ---
function SessionPicker({ onAdd }) {
  const [name, setName] = useState("");
  const [priceEu, setPriceEu] = useState("");

  const add = () => {
    const price = Math.round(Number(String(priceEu).replace(",", ".")) * 100);
    if (!name || !Number.isFinite(price) || price <= 0) return;
    onAdd({ label: name, montantCent: price, inscriptionId: Date.now() % 1e9 });
    setName("");
    setPriceEu("");
  };

  return (
    <div className="card">
      <h3>Ajouter une session</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Prix (€)" value={priceEu} onChange={(e) => setPriceEu(e.target.value)} />
        <button className="btn-secondary" onClick={add}>Ajouter</button>
      </div>
      <p style={{ opacity: .7, marginTop: 6 }}>Tu peux saisir autant de lignes que nécessaire.</p>
    </div>
  );
}

function Cart({ lignes, onRemove }) {
  const total = useMemo(() => lignes.reduce((s, l) => s + l.montantCent, 0), [lignes]);

  return (
    <div className="card">
      <h3>Panier</h3>
      {lignes.length === 0 ? (
        <em>Vide</em>
      ) : (
        <ul>
          {lignes.map((l) => (
            <li key={l.inscriptionId} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{l.label}</span>
              <span>
                {currencyCents(l.montantCent)}{" "}
                <button className="btn-secondary" onClick={() => onRemove(l.inscriptionId)}>Suppr</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="total">Total : {currencyCents(total)}</div>
    </div>
  );
}

function PayForm({ lignes, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("test@example.com");
  const [apprenantId, setApprenantId] = useState(1);
  const [log, setLog] = useState(null);
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => lignes.reduce((s, l) => s + l.montantCent, 0), [lignes]);

  async function handlePay() {
  if (!stripe || !elements || lignes.length === 0) return;

  try {
    setBusy(true);
    setLog(null);

    // 1️⃣ Créer le paiement côté API (statut = CREATED)
    const r = await createPayment({
      apprenantId: Number(apprenantId),
      email,
      lignes: lignes.map((l) => ({ inscriptionId: l.inscriptionId, montantCent: l.montantCent })),
    });

    // 2️⃣ Confirmer le paiement côté client (Stripe)
    const { error, paymentIntent } = await stripe.confirmCardPayment(r.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { email },
      },
    });

    if (error) {
      setLog({ type: "error", error });
      onPaid?.(null, r, error);
      return;
    }

    // ✅ 3️⃣ Synchroniser la base de données après confirmation
    await syncPayment(r.paiementId);

    setLog({ type: "ok", paymentIntent, api: r });
    onPaid?.(paymentIntent, r, null);
    elements.getElement(CardElement)?.clear();
  } catch (e) {
    setLog({ type: "error", error: e });
  } finally {
    setBusy(false);
  }
}


  return (
    <div className="card">
      <h3>Paiement</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={apprenantId} onChange={(e) => setApprenantId(e.target.value)} placeholder="Apprenant ID" />
        <div className="card-input">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <button disabled={!stripe || busy || total <= 0} onClick={handlePay}>
          Payer {total > 0 ? `(${currencyCents(total)})` : ""}
        </button>
      </div>
      {log && <pre className={`log ${log.type}`}>{JSON.stringify(log, null, 2)}</pre>}
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

  const filtered = useMemo(
    () => (onlyPending ? items.filter((p) => p.statut === "CREATED") : items),
    [items, onlyPending]
  );

  async function onCancel(id) {
    setBusyId(id);
    try { await cancelPayment(id); await reload(); } finally { setBusyId(null); }
  }
  async function onRefund(id) {
    setBusyId(id);
    try { await refundPayment(id, "UI refund"); await reload(); } finally { setBusyId(null); }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Historique des paiements</h3>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} />
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
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.apprenantId}</td>
              <td>{currencyCents(p.montantTotalCent)}</td>
              <td><span className={`badge ${p.statut}`}>{p.statut}</span></td>
              <td>{new Date(p.dateCreation).toLocaleString()}</td>
              <td style={{ display: "flex", gap: 8 }}>
                {p.statut === "CREATED" && (
                  <button className="btn-secondary" disabled={busyId === p.id} onClick={() => onCancel(p.id)}>
                    Annuler
                  </button>
                )}
                {p.statut === "PAID" && (
                  <button className="btn-danger" disabled={busyId === p.id} onClick={() => onRefund(p.id)}>
                    Rembourser
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn-secondary" onClick={reload} style={{ marginTop: 8 }}>Rafraîchir</button>
    </div>
  );
}

// --- App roots ---
function AppInner() {
  const [lignes, setLignes] = useState([
    { inscriptionId: 10, label: "Session A", montantCent: 5000 },
    { inscriptionId: 11, label: "Session B", montantCent: 2500 },
  ]);

  return (
    <div className="wrap">
      <h2>TrainU — Paiements</h2>
      <div className="grid">
        <SessionPicker onAdd={(l) => setLignes((prev) => [...prev, l])} />
        <Cart lignes={lignes} onRemove={(id) => setLignes((prev) => prev.filter((l) => l.inscriptionId !== id))} />
        <PayForm lignes={lignes} onPaid={() => setLignes([])} />
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

/* ---------- minimal, responsive CSS (injected) ---------- */
const style = document.createElement("style");
style.textContent = `
  :root{
    --bg:#0c0c0e; --panel:#141416; --panel-border:#25262b; --text:#e7e7ea;
    --muted:#a8abb3; --accent:#2e7bf6; --accent-2:#1e5ad1;
  }
  @media (prefers-color-scheme: light){
    :root{ --bg:#f7f8fb; --panel:#fff; --panel-border:#e6e8ef; --text:#0e1020; --muted:#4b5060; }
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial}
  .wrap{max-width:1100px;margin:24px auto;padding:0 16px}
  h2{margin:0 0 16px;font-size:28px}
  h3{margin:0 0 12px;font-size:18px}
  .grid{display:grid;gap:16px;grid-template-columns:repeat(12,1fr)}
  .card:nth-of-type(1){grid-column:span 4}
  .card:nth-of-type(2){grid-column:span 4}
  .card:nth-of-type(3){grid-column:span 4}
  .card:nth-of-type(4){grid-column:1 / -1}
  @media (max-width:980px){ .card{grid-column:1 / -1 !important} }
  .card{background:var(--panel);border:1px solid var(--panel-border);border-radius:14px;padding:14px;box-shadow:0 4px 14px rgba(0,0,0,.12)}
  input{width:100%;background:#0d0e10;border:1px solid var(--panel-border);border-radius:10px;padding:10px 12px;color:var(--text);outline:none;transition:border .15s,box-shadow .15s}
  input::placeholder{color:var(--muted)}
  input:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in oklab, var(--accent) 30%, transparent)}
  .card-input{background:#0d0e10;border:1px solid var(--panel-border);border-radius:10px;padding:12px}
  button{border:1px solid var(--panel-border);background:linear-gradient(180deg,var(--accent),var(--accent-2));color:#fff;border-radius:10px;padding:10px 14px;cursor:pointer;transition:transform .04s,filter .15s,opacity .15s}
  .btn-secondary{background:#1b1c20;color:#e7e7ea}
  .btn-danger{background:linear-gradient(180deg,#ef5350,#d32f2f)}
  button:active{transform:translateY(1px)} button:disabled{background:#2a2b31;color:#b9bcc6;opacity:.7;cursor:not-allowed}
  ul{list-style:none;margin:0;padding:0}
  li{padding:6px 0;border-bottom:1px dashed var(--panel-border)}
  li:last-child{border-bottom:0}
  .total{margin-top:8px;font-weight:700}
  .table{width:100%;border-collapse:collapse;margin-top:6px;font-size:15px}
  .table th,.table td{padding:10px;border-bottom:1px solid var(--panel-border);text-align:left}
  .table tbody tr:hover{background:rgba(255,255,255,.03)}
  .badge{display:inline-block;padding:.15rem .5rem;border-radius:999px;font-size:12px;font-weight:600}
  .badge.CREATED{background:#1f2430;color:#c3d3ff;border:1px solid #2a3350}
  .badge.PAID{background:#10381e;color:#a7f3c6;border:1px solid #1e6b3b}
  .badge.FAILED{background:#3a1c1c;color:#ffc9c9;border:1px solid #5a2424}
  .badge.REFUNDED{background:#172436;color:#b9d4ff;border:1px solid #274b78}
  .log{white-space:pre-wrap;background:#0b0c10;border:1px solid var(--panel-border);padding:10px;border-radius:10px;margin-top:10px}
  .log.error{border-color:#5a1f1f;background:#1a0f11}
`;
document.head.appendChild(style);

import { useState } from "react";

const apiBase = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export default function App() {
  const [email, setEmail] = useState("test@example.com");
  const [apprenantId, setApprenantId] = useState(1);
  const [lignes, setLignes] = useState([
    { inscriptionId: 10, montantCent: 5000 },
    { inscriptionId: 11, montantCent: 2500 },
  ]);

  const [loading, setLoading] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const [log, setLog] = useState([]);

  const appendLog = (x) => setLog((prev) => [JSON.stringify(x, null, 2), ...prev]);

  async function createPayment() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apprenantId, email, lignes }),
      });
      const json = await res.json();
      appendLog(json);
      if (!res.ok) throw new Error(json.message || res.statusText);
      setLastPayment(json); // { paiementId, paymentIntentId, ... }
    } catch (e) {
      appendLog({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function refundLast() {
    if (!lastPayment?.paiementId) {
      appendLog({ error: "Aucun paiement à rembourser" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/payments/${lastPayment.paiementId}/refunds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motif: "Test refund", noteInterne: "UI test" }),
      });
      const json = await res.json();
      appendLog(json);
      if (!res.ok) throw new Error(json.message || res.statusText);
    } catch (e) {
      appendLog({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  function updateLigne(idx, patch) {
    setLignes((arr) => arr.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function addLigne() {
    setLignes((arr) => [...arr, { inscriptionId: 99, montantCent: 1000 }]);
  }

  function removeLigne(idx) {
    setLignes((arr) => arr.filter((_, i) => i !== idx));
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 820, margin: "0 auto" }}>
      <h1>TrainU — Paiement test</h1>

      <section style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Créer un paiement</h2>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
          <label>
            Apprenant ID
            <input type="number" value={apprenantId} onChange={(e) => setApprenantId(+e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>

        <h3 style={{ marginTop: 12 }}>Lignes</h3>
        {lignes.map((l, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 6 }}>
            <input
              type="number"
              value={l.inscriptionId}
              onChange={(e) => updateLigne(idx, { inscriptionId: +e.target.value })}
              placeholder="inscriptionId"
            />
            <input
              type="number"
              value={l.montantCent}
              onChange={(e) => updateLigne(idx, { montantCent: +e.target.value })}
              placeholder="montantCent (centimes)"
            />
            <button onClick={() => removeLigne(idx)}>Suppr</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={addLigne}>+ Ajouter une ligne</button>
          <button onClick={createPayment} disabled={loading}>
            {loading ? "..." : "Créer & payer (test)"}
          </button>
        </div>
      </section>

      <section style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Dernier paiement</h2>
        {lastPayment ? (
          <>
            <div>
              <strong>ID:</strong> {lastPayment.paiementId} — <strong>Statut:</strong> {lastPayment.status}
            </div>
            <div style={{ wordBreak: "break-all" }}>
              <strong>Intent:</strong> {lastPayment.paymentIntentId}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={refundLast} disabled={loading}>Rembourser</button>
            </div>
          </>
        ) : (
          <em>Pas encore de paiement</em>
        )}
      </section>

      <section style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Logs</h2>
        {log.length === 0 && <em>Aucun log</em>}
        <ul style={{ display: "grid", gap: 8, listStyle: "none", padding: 0 }}>
          {log.map((l, i) => (
            <li key={i}>
              <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#0f0", padding: 12, borderRadius: 6 }}>
                {l}
              </pre>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

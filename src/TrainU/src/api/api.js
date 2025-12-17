const BASE = import.meta.env.VITE_API_BASE;

export async function createPayment({ apprenantId, email, lignes }) {
  const res = await fetch(`${BASE}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apprenantId, email, lignes }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error("createPayment failed"));
  return res.json();
}

export async function listPayments() {
  const res = await fetch(`${BASE}/api/payments`);
  if (!res.ok) throw await res.json().catch(() => new Error("listPayments failed"));
  return res.json();
}

export async function cancelPayment(id) {
  const res = await fetch(`${BASE}/api/payments/${id}/cancel`, { method: "POST" });
  if (!res.ok) throw await res.json().catch(() => new Error("cancelPayment failed"));
  return res.json();
}

export async function refundPayment(id, motif = "UI") {
  const res = await fetch(`${BASE}/api/payments/${id}/refunds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ motif }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error("refundPayment failed"));
  return res.json();
}

export async function syncPayment(id) {
  const res = await fetch(`${BASE}/api/payments/${id}/sync`, { method: "POST" });
  if (!res.ok) throw await res.json().catch(() => new Error("syncPayment failed"));
  return res.json();
}


export async function login(email, Login, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Bad credentials");
  }

  return res.json();
}

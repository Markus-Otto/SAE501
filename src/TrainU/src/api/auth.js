// auth.js
const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function loginRequest({ email, password }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }), // ⚠️ noms de champs EXACTS
  });

  if (!res.ok) {
    // Essaie de récupérer le message d'erreur Spring pour le debug
    let details = "";
    try {
      const data = await res.json();
      details = data.message || JSON.stringify(data);
    } catch {
      // rien
    }
    throw new Error(details || `Login failed (${res.status})`);
  }

  return res.json(); // { id, email, role, token }
}

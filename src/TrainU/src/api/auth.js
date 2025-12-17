// auth.js
const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function loginRequest({ email, password, role }) {
  
  const endpoint = `${BASE}/api/auth/login`; 

  const bodyData = { 
    email, 
    password,
    role // ✅ Inclure le rôle dans la requête
  };
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData), 
  });

  if (!res.ok) {
    let details = "";
    try {
      const data = await res.json();
      details = data.message || JSON.stringify(data);
    } catch {
      // rien
    }
    throw new Error(details || `Login failed (${res.status})`);
  }

  return res.json();
}
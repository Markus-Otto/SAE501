// auth.js

export async function loginRequest({ email, password, role }) {
  
  const res = await fetch("https://java-trainu.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }), 
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erreur de connexion");
  }
  return res.json();
}
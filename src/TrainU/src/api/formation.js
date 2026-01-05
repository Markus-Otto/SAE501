const API_BASE = "https://java-trainu.onrender.com/api/formation";



/**
 * Récupère toutes les formations
 */
export async function getFormations() {
  const res = await fetch(API_BASE);

  if (!res.ok) {
    throw new Error("Impossible de charger les formations");
  }

  return res.json();
}

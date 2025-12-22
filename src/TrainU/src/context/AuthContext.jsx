import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("trainu_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      } catch (e) {
        localStorage.removeItem("trainu_auth");
      }
    }
    setLoading(false);
  }, []);

  const login = (apiResponse) => {
    // apiResponse correspond au record LoginResponse Java
    // L'ordre dans Java est : id, email, nom, prenom, role, token
    const formattedData = {
      user: {
        id: apiResponse.id,
        email: apiResponse.email,
        nom: apiResponse.nom,      // Récupère "Martin" par exemple
        prenom: apiResponse.prenom, // Récupère "Lucas" par exemple
        role: apiResponse.role
      },
      token: apiResponse.token
    };

    setUser(formattedData.user);
    setToken(formattedData.token);
    // Sauvegarde immédiate pour que le Dashboard lise les nouvelles valeurs
    localStorage.setItem("trainu_auth", JSON.stringify(formattedData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("trainu_auth");
  };

  const value = { 
    user, 
    token, 
    loading, 
    login, 
    logout, 
    isAuthenticated: !!user 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
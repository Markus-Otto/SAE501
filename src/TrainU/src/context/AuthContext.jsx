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
        // On s'assure que la structure est la bonne avant de charger
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
    // apiResponse est ce que renvoie Java : { id, email, role, token }
    // On formate pour que user.role soit accessible
    const formattedData = {
      user: {
        id: apiResponse.id,
        email: apiResponse.email,
        role: apiResponse.role
      },
      token: apiResponse.token
    };

    setUser(formattedData.user);
    setToken(formattedData.token);
    localStorage.setItem("trainu_auth", JSON.stringify(formattedData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("trainu_auth");
  };

  const value = { user, token, loading, login, logout, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
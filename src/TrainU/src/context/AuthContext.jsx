import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // {id, username, role}
  const [token, setToken] = useState(null);   // JWT
  const [loading, setLoading] = useState(true);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("trainu_auth");
    if (saved) {
      const { user, token } = JSON.parse(saved);
      setUser(user);
      setToken(token);
    }
    setLoading(false);
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("trainu_auth", JSON.stringify({ user, token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("trainu_auth");
  };

  const value = { user, token, loading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

const login = async (email, password) => {
  const { data } = await loginUser({ email, password });

  const normalizedUser = {
    ...data.user,
    role: data.user.role.toLowerCase()
  };

  setToken(data.token);
  setUser(normalizedUser);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(normalizedUser));

  return normalizedUser.role;
};


  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [name, setName] = useState(localStorage.getItem("name") || null);

  const login = (token, role, name) => {
    setToken(token);
    setRole(role);
    setName(name);

    // Store login data in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setName(null);
    
    // Remove data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
  };

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

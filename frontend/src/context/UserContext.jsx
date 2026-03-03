import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://letterlab-backend.vercel.app";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${backendURL}/auth/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // ✅ User object now includes firstName and lastName
        setUser(res.data.user);
      })
      .catch(() => localStorage.removeItem("authToken"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Add logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}
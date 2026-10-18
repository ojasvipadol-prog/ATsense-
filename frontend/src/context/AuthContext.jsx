import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('atsense-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('atsense-token') || null);
  const [loading, setLoading] = useState(false);

  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('atsense-user', JSON.stringify(userData));
    localStorage.setItem('atsense-token', userToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('atsense-user');
    localStorage.removeItem('atsense-token');
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 1,
      name: "Alex Morgan",
      email: "demo@atsense.ai"
    };
    loginUser(demoUser, "demo-session-token-atsense-2026");
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      loginUser,
      logoutUser,
      loginAsDemo,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

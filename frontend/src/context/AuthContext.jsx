import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI
      .me()
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        localStorage.removeItem('wl_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const res = await authAPI.login(credentials);
    const { user: loggedInUser, token } = res.data.data;
    if (token) {
      localStorage.setItem('wl_token', token);
    }
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(data) {
    const res = await authAPI.register(data);
    const { user: registeredUser, token } = res.data.data;
    if (token) {
      localStorage.setItem('wl_token', token);
    }
    setUser(registeredUser);
    return registeredUser;
  }

  async function logout() {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('wl_token');
      setUser(null);
    }
  }

  function updateUser(updated) {
    setUser((prev) => ({ ...prev, ...updated }));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

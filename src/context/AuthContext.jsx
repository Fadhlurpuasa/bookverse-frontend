import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/endpoints';
import { unwrap } from '../utils/format';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('bookverse_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('bookverse_token');
  const isAdmin = user?.role === 'ADMIN';
  const isLoggedIn = Boolean(token && user);

  useEffect(() => {
    if (!token) return;
    authApi.me()
      .then((res) => {
        const profile = unwrap(res);
        setUser(profile);
        localStorage.setItem('bookverse_user', JSON.stringify(profile));
      })
      .catch(() => logout());
  }, []);

  async function login(payload) {
    setLoading(true);
    try {
      const res = await authApi.login(payload);
      const data = unwrap(res);
      localStorage.setItem('bookverse_token', data.token);
      localStorage.setItem('bookverse_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const res = await authApi.register(payload);
      const data = unwrap(res);
      localStorage.setItem('bookverse_token', data.token);
      localStorage.setItem('bookverse_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('bookverse_token');
    localStorage.removeItem('bookverse_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, loading, isAdmin, isLoggedIn, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

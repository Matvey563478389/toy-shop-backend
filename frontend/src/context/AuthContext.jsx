import { createContext, useContext, useState, useEffect } from 'react';
import api from "../shared/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/user/me');
        setUser(res.data);
      } catch {
        try {
          await api.post('/user/refresh');
          const res = await api.get('/user/me');
          setUser(res.data);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    void checkAuth();
  }, []);

  const login = async (email, password) => {
    await api.post('/user/sign-in', { email, password });
    const userRes = await api.get('/user/me');
    setUser(userRes.data);
  };

  const register = async (userData) => {
    await api.post('/user/sign-up', userData);
    const userRes = await api.get('/user/me');
    setUser(userRes.data);
  };

  const updateProfile = async (name, address, phone) => {
    const res = await api.put('/user/profile', { name, address, phone });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
    } catch {
      void 0;
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

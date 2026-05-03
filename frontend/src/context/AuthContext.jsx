import { createContext, useContext, useState, useEffect } from 'react';
import api from "../shared/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user/me');
          setUser(res.data);
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth().then(r => r);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/user/sign-in', { email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);

    const userRes = await api.get('/user/me');
    setUser(userRes.data);
  };

  const register = async (userData) => {
    const res = await api.post('/user/sign-up', userData);
    const token = res.data.token;

    localStorage.setItem('token', token);

    const userRes = await api.get('/user/me');
    setUser(userRes.data);
  };

  const updateProfile = async (name, address, phone) => {
    const res = await api.put('/user/profile', { name, address, phone });
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
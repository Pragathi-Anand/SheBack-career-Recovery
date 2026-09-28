import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sheback_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sheback_token') || '');
  const [loading, setLoading] = useState(true);

  // Configure Axios Defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load User & Profile on Mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/profile');
          if (res.data.success) {
            setProfile(res.data.profile);
            const syncedUser = res.data.user || {
              id: res.data.profile.user,
              name: res.data.profile.name,
              email: user?.email || '',
              onboarded: true,
            };
            setUser(syncedUser);
            localStorage.setItem('sheback_user', JSON.stringify(syncedUser));
          }
        } catch (err) {
          console.warn('Profile fetch note:', err.response?.data?.message);
          if (err.response?.data?.user) {
            setUser(err.response.data.user);
            localStorage.setItem('sheback_user', JSON.stringify(err.response.data.user));
          }
          // If token invalid, clear
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const loginUser = (tokenData, userData) => {
    localStorage.setItem('sheback_token', tokenData);
    if (userData) {
      localStorage.setItem('sheback_user', JSON.stringify(userData));
    }
    setToken(tokenData);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
  };

  const logout = () => {
    localStorage.removeItem('sheback_token');
    localStorage.removeItem('sheback_user');
    setToken('');
    setUser(null);
    setProfile(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfileData = (newProfile) => {
    setProfile(newProfile);
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        id: newProfile.user || prev?.id,
        name: newProfile.name || prev?.name,
        email: prev?.email || '',
        onboarded: true,
      };
      try {
        localStorage.setItem('sheback_user', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error persisting user to localStorage', e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        loginUser,
        logout,
        updateProfileData,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

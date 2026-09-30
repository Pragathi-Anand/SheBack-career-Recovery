import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// In production (Vercel), VITE_API_URL is set to the public Render backend URL.
// In local dev, it is empty so the Vite proxy handles /api/* requests.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';


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

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sheback_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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
          if (res.data.success && res.data.profile) {
            setProfile(res.data.profile);
            try {
              localStorage.setItem('sheback_profile', JSON.stringify(res.data.profile));
            } catch (e) {
              console.warn('Failed to cache profile in localStorage', e);
            }

            const syncedUser = res.data.user || {
              id: res.data.profile.userId || res.data.profile.user || user?.id,
              name: res.data.profile.name || user?.name,
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
    localStorage.removeItem('sheback_profile');
    setToken('');
    setUser(null);
    setProfile(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfileData = (newProfile) => {
    if (!newProfile) return;

    setProfile((prevProfile) => {
      const merged = { ...(prevProfile || {}), ...newProfile };
      try {
        localStorage.setItem('sheback_profile', JSON.stringify(merged));
      } catch (e) {
        console.warn('Error persisting profile to localStorage', e);
      }
      return merged;
    });

    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        id: newProfile.userId || newProfile.user || prev?.id,
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

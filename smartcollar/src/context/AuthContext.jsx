import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { dogId, name, photo, type } or { username, type: 'admin' }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartcollar_auth');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('smartcollar_auth', JSON.stringify(user));
    else localStorage.removeItem('smartcollar_auth');
  }, [user]);

  const loginWithDogId = async (dogId) => {
    setLoading(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 600));
    const profile = {
      dogId,
      name: 'Max',
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      type: 'user'
    };
    setUser(profile);
    setLoading(false);
    return profile;
  };

  const loginWithAdmin = async (username, password) => {
    setLoading(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 600));
    
    if (username === 'admin' && password === '123') {
      const adminProfile = {
        username: 'admin',
        type: 'admin'
      };
      setUser(adminProfile);
      setLoading(false);
      return adminProfile;
    } else {
      setLoading(false);
      throw new Error('Invalid admin credentials');
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (user?.type !== 'admin') {
      throw new Error('Only admin can change password');
    }
    
    // In a real app, this would validate against stored password and update it
    // For now, we'll just simulate success
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: 'Password changed successfully' };
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ 
    user, 
    loading, 
    loginWithDogId, 
    loginWithAdmin, 
    changePassword, 
    logout 
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

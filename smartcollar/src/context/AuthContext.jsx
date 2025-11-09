import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { saveLoginEmail } from '@/services/userStore';
import { auth } from '@/services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { dogId, name, photo, type } or { username, type: 'admin' }
  const [loading, setLoading] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null); // { dogId, name, photo }

  useEffect(() => {
    const saved = localStorage.getItem('smartcollar_auth');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    const savedDog = localStorage.getItem('smartcollar_selected_dog');
    if (savedDog) {
      try { setSelectedDog(JSON.parse(savedDog)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('smartcollar_auth', JSON.stringify(user));
    else localStorage.removeItem('smartcollar_auth');
  }, [user]);

  useEffect(() => {
    if (selectedDog) localStorage.setItem('smartcollar_selected_dog', JSON.stringify(selectedDog));
    else localStorage.removeItem('smartcollar_selected_dog');
  }, [selectedDog]);

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

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    const e = String(email || '').toLowerCase();
    try {
      // First try to sign in directly
      const cred = await signInWithEmailAndPassword(auth, e, password);
      const uid = cred.user.uid;
      const profile = buildProfileFromEmail(e);
      setUser(profile);
      await saveLoginEmail(e, profile, uid);
      return profile;
    } catch (err) {
      // If user not found, create new account
      if (err?.code === 'auth/user-not-found') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, e, password);
          const uid = cred.user.uid;
          const profile = buildProfileFromEmail(e);
          setUser(profile);
          await saveLoginEmail(e, profile, uid);
          return profile;
        } catch (signUpErr) {
          console.error('Sign up error:', signUpErr);
          throw new Error('Failed to create account. Please try again.');
        }
      }
      
      // Handle other errors
      if (err?.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (err?.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. Please try again later.');
      } else if (err?.code === 'auth/email-already-in-use') {
        // If email is already in use, try to sign in instead
        try {
          const cred = await signInWithEmailAndPassword(auth, e, password);
          const uid = cred.user.uid;
          const profile = buildProfileFromEmail(e);
          setUser(profile);
          await saveLoginEmail(e, profile, uid);
          return profile;
        } catch (signInErr) {
          console.error('Sign in error:', signInErr);
          throw new Error('Failed to sign in. Please check your credentials.');
        }
      } else {
        console.error('Authentication error:', err);
        throw new Error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const mapFirebaseError = (err) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a minute and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      default:
        return `Firebase: ${err?.message || 'Authentication failed.'}`;
    }
  };

  const buildProfileFromEmail = (e) => {
    if (e.includes('buddy')) {
      return {
        dogId: 'BUD-123',
        name: 'Buddy',
        photo: 'https://images.unsplash.com/photo-1558944351-c0d0d4d0f4b9?q=80&w=600&auto=format&fit=crop',
        type: 'user',
      };
    }
    if (e.includes('tom')) {
      return {
        dogId: 'TOM-456',
        name: 'Tom',
        photo: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop',
        type: 'user',
      };
    }
    return {
      dogId: 'DOG-001',
      name: 'Pet',
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      type: 'user',
    };
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

  const logout = () => { setUser(null); setSelectedDog(null); };

  const selectDogProfile = (profile) => {
    const { dogId, name, photo } = profile || {};
    if (!dogId) return;
    setSelectedDog({ dogId, name: name || 'Dog', photo });
  };

  const value = useMemo(() => ({ 
    user, 
    loading,
    selectedDog,
    loginWithDogId, 
    loginWithEmail,
    loginWithAdmin, 
    changePassword, 
    logout,
    selectDogProfile
  }), [user, loading, selectedDog]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

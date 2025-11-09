import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'smartcollar_profiles';

const defaultProfiles = [
  {
    id: 'BUD-123',
    name: 'Buddy',
    breed: 'Golden Retriever',
    ageYears: 3,
    owner: 'Sarah Johnson',
    contact: '+1 (555) 123-4567',
    heartRate: 145,
    behavior: 'Anxious',
    photo: 'https://images.unsplash.com/photo-1558944351-c0d0d4d0f4b9?q=80&w=600&auto=format&fit=crop',
    locked: true
  },
  {
    id: 'TOM-456',
    name: 'Tom',
    breed: 'Labrador',
    ageYears: 2,
    owner: 'Mike Smith',
    contact: '+1 (555) 987-6543',
    heartRate: 112,
    behavior: 'Calm',
    photo: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop'
  }
];

const ProfilesContext = createContext(null);

export const useProfiles = () => useContext(ProfilesContext);

export const ProfilesProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);

  // load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
        return;
      } catch {}
    }
    setProfiles(defaultProfiles);
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const exists = (id) => profiles.some((p) => String(p.id).trim() === String(id).trim());

  const addProfile = (id) => {
    const clean = String(id).trim();
    if (!clean) throw new Error('Dog ID is required');
    if (exists(clean)) throw new Error('Dog ID already exists');
    setProfiles((prev) => [...prev, { id: clean }]);
  };

  const deleteProfile = (id) => {
    setProfiles((prev) => {
      const target = prev.find((p) => String(p.id) === String(id));
      if (target?.locked) return prev; // prevent deletion of locked profile
      return prev.filter((p) => String(p.id) !== String(id));
    });
  };

  const value = useMemo(
    () => ({ profiles, addProfile, deleteProfile, exists }),
    [profiles]
  );

  return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
};

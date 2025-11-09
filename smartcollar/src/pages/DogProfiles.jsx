import React, { useEffect, useMemo, useState } from 'react';
import './DogProfiles.css';
import { useProfiles } from '@/context/ProfilesContext';
import { useAuth } from '@/context/AuthContext';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DogProfiles = () => {
  const { profiles, addProfile, deleteProfile } = useProfiles();
  const { user, selectDogProfile } = useAuth();
  const isAdmin = (typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true') || user?.type === 'admin';
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [newId, setNewId] = useState('');
  const [err, setErr] = useState('');
  const [query, setQuery] = useState('');

  // Fallback sample data when there are no profiles yet
  const fallbackProfiles = [
    {
      id: 'BUD-123',
      name: 'Buddy',
      breed: 'Golden Retriever',
      ageYears: 3,
      owner: 'Gowtham',
      contact: '+91 98765 43210',
      heartRate: 145,
      behavior: 'Anxious',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'TOM-456',
      name: 'Tom',
      breed: 'Beagle',
      ageYears: 3,
      owner: 'Koushik',
      contact: '+91 91234 56789',
      heartRate: 112,
      behavior: 'Calm',
      photo: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6e?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const handleOpen = () => { if (isAdmin) { setNewId(''); setErr(''); setOpen(true); } };
  const handleClose = () => setOpen(false);
  const handleSave = () => {
    try {
      addProfile(newId);
      setOpen(false);
    } catch (e) {
      setErr(e.message || 'Failed to add profile');
    }
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    deleteProfile(id);
  };

  // Guard route: redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = profiles && profiles.length ? profiles : fallbackProfiles;
    return list.filter((p) =>
      [p.id, p.name, p.owner, p.breed].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [profiles, query]);

  const handleSelect = (p) => {
    if (!isAdmin) return;
    // Save to auth context (if used elsewhere)
    selectDogProfile({ dogId: p.id, name: p.name, photo: p.photo });
    // Persist for Dashboard (image + basic fields)
    try {
      const stored = {
        id: p.id,
        name: p.name,
        breed: p.breed,
        age: p.ageYears ? `${p.ageYears} years` : (p.age || ''),
        gender: p.gender || 'Male',
        image: p.photo
      };
      localStorage.setItem('selectedProfile', JSON.stringify(stored));
    } catch {}
    navigate('/dashboard');
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 }, width: '100%' }}>
    <div className="dog-profiles-container">
      <div className="dp-header">
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Dog Profiles</Typography>
        {isAdmin && (
          <Button 
            variant="contained" 
            onClick={handleOpen}
            size="small"
            sx={{ borderRadius: '999px', px: 2.5, fontWeight: 700, textTransform: 'uppercase' }}
          >
            Add New Dog
          </Button>
        )}
      </div>
      <input
        className="dp-search"
        placeholder="Search dogs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="dog-profiles-grid">
        {filtered.map((p) => (
          <div key={p.id} className="dog-profile-card" onClick={() => handleSelect(p)}>
            <div className="dog-profile-header">
              <span />
              <span className="dog-id">ID: {p.id}</span>
              {isAdmin && !p.locked && profiles && profiles.length > 0 && (
                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} title="Delete">×</button>
              )}
            </div>
            <div className="dp-body">
              <img src={p.photo} alt={p.name} className="dp-avatar" />
              <div className="dp-info">
                <div className="dp-name">{p.name}</div>
                <div className="dp-sub">{p.breed}{p.ageYears ? `, ${p.ageYears} years old` : ''}</div>
                <div className="dp-row"><span>Owner:</span><b>{p.owner || '-'}</b></div>
                <div className="dp-row"><span>Contact:</span><b>{p.contact || '-'}</b></div>
                {p.heartRate && (
                  <div className="dp-row"><span>Heart Rate:</span><b className={p.heartRate > 130 ? 'warn' : 'ok'}>{p.heartRate} BPM</b></div>
                )}
                {p.behavior && (
                  <div className="dp-row"><span>Behavior:</span><b>{p.behavior}</b></div>
                )}
                <div className="dp-actions">
                  <span className="dp-link">Edit</span>
                  {isAdmin && !p.locked && <span className="dp-link danger" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>Delete</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isAdmin && (
          <button className="add-dog-profile-card" onClick={handleOpen} title="Add new Dog ID">
            <p>+</p>
          </button>
        )}
      </div>

      {/* Add Profile Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Add Dog Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Dog ID"
              fullWidth
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
            />
            {err && (
              <Typography variant="caption" color="error">{err}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
    </Box>
  );
};

export default DogProfiles;

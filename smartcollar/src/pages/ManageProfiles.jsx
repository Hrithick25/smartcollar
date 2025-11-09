import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const defaultProfiles = [
  {
    id: 'BUD-123',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'TOM-456',
    name: 'Tom',
    type: 'Dog',
    breed: 'Beagle',
    age: '3 years',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop',
  }
];

const ManageProfiles = () => {
  const [profiles, setProfiles] = useState(defaultProfiles);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const navigate = useNavigate();

  const handleProfileSelect = (profile) => {
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
    navigate('/dashboard');
  };

  const handleEdit = (profile, e) => {
    e.stopPropagation();
    setCurrentProfile(profile);
    setOpenDialog(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const handleSave = () => {
    // In a real app, you would save to the backend here
    setOpenDialog(false);
    setCurrentProfile(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>Manage Pet Profiles</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => {
            setCurrentProfile({
              id: `DOG-${Math.floor(100 + Math.random() * 900)}`,
              name: '',
              type: 'Dog',
              breed: '',
              age: '',
              gender: 'Male',
              image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'
            });
            setOpenDialog(true);
          }}
        >
          Add New Pet
        </Button>
      
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleProfileSelect(profile)}
            >
              <CardMedia
                component="img"
                height="200"
                image={profile.image}
                alt={profile.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography gutterBottom variant="h5" component="div">
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.breed} • {profile.age} • {profile.gender}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      ID: {profile.id}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => handleEdit(profile, e)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => handleDelete(profile.id, e)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentProfile?.id ? 'Edit Profile' : 'Add New Profile'}</DialogTitle>
        <DialogContent>
          {currentProfile && (
            <Box sx={{ pt: 2 }}>
              <TextField
                label="Pet Name"
                fullWidth
                value={currentProfile.name}
                onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Breed"
                fullWidth
                value={currentProfile.breed}
                onChange={(e) => setCurrentProfile({...currentProfile, breed: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Age"
                fullWidth
                value={currentProfile.age}
                onChange={(e) => setCurrentProfile({...currentProfile, age: e.target.value})}
                margin="normal"
              />
              <TextField
                label="Gender"
                select
                fullWidth
                value={currentProfile.gender}
                onChange={(e) => setCurrentProfile({...currentProfile, gender: e.target.value})}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default ManageProfiles;

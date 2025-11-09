import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const profiles = [
  {
    id: 'BUD-123',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1558944351-c0d0d4d0f4b9?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'TOM-456',
    name: 'Tom',
    type: 'Dog',
    breed: 'Beagle',
    age: '3 years',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop',
  }
];

const SelectProfile = () => {
  const navigate = useNavigate();

  const handleProfileSelect = (profile) => {
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
    navigate('/dashboard');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Select a Profile
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <Card 
              sx={{ 
                maxWidth: 345, 
                mx: 'auto',
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
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.breed} • {profile.age} • {profile.gender}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          color="error"
          onClick={() => window.close()}
          sx={{ mt: 2 }}
        >
          Exit
        </Button>
      </Box>
    </Box>
  );
};

export default SelectProfile;

import React from 'react';
import { Avatar, Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { useProfiles } from '@/context/ProfilesContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HeartPulseIcon from '@mui/icons-material/MonitorHeart';
import ShieldIcon from '@mui/icons-material/Shield';
import CloudIcon from '@mui/icons-material/Cloud';

const Home = () => {
  const { profiles } = useProfiles();
  const { user, selectDogProfile } = useAuth();
  const isAdmin = user?.type === 'admin';
  const navigate = useNavigate();

  const handlePick = (p) => {
    if (!isAdmin) return;
    selectDogProfile({ dogId: p.id, name: p.name, photo: p.photo });
    navigate('/dashboard');
  };
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* HERO (text-only, no images) */}
      <Box sx={{
        background: `linear-gradient(180deg, rgba(42,127,107,0.10), transparent), radial-gradient(1000px 500px at 85% -10%, rgba(90,99,164,0.18), transparent)`,
        py: { xs: 6, md: 8 },
      }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>SmartCollar</Typography>
            <Typography variant="body1" color="text.secondary">
              Track vitals, understand behavior, and keep pets safer with a real-time connected collar and a clean dashboard.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip label="Live HR & HRV" color="success" variant="outlined" />
              <Chip label="Behavior Signals" variant="outlined" />
              <Chip label="Cloud Storage" variant="outlined" />
              <Chip label="ML Insights" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 1 }}>
              <Button variant="contained" color="primary" href="#how">How it works</Button>
              <Button variant="outlined" color="primary" href="#specs">Overview</Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* How it works (iconic cards) */}
      <Container id="how" maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <HeartPulseIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>Live Telemetry</Typography>
                <Typography variant="body2" color="text.secondary">Heart rate and motion signals are streamed continuously to establish a personal baseline.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <CloudIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>Sync to Cloud</Typography>
                <Typography variant="body2" color="text.secondary">Data is stored securely for history, comparisons, and device fleet management.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <AnalyticsIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>ML Insights</Typography>
                <Typography variant="body2" color="text.secondary">Models flag stress patterns and predict short-term risk to support early action.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Dogs gallery */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Dogs</Typography>
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
          {profiles.map((p) => (
            <Stack key={p.id} spacing={0.5} sx={{ alignItems: 'center', cursor: isAdmin ? 'pointer' : 'default' }} onClick={() => handlePick(p)}>
              <Avatar src={p.photo} alt={p.name} sx={{ width: 64, height: 64, border: '3px solid rgba(29,78,216,0.15)' }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
            </Stack>
          ))}
        </Stack>
      </Container>

      {/* Stats + Overview */}
      <Container id="specs" maxWidth="lg" sx={{ pb: 8 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Project Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Device</Typography>
                <Typography variant="body2">ESP32-based collar with HR sensing</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Cloud</Typography>
                <Typography variant="body2">Secure storage and aggregation for analytics</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Dashboard</Typography>
                <Typography variant="body2">React + MUI with role-based access control</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}><Typography variant="h5" sx={{ fontWeight: 800 }}>24/7</Typography><Typography variant="caption" color="text.secondary">Monitoring</Typography></Grid>
              <Grid item xs={4}><Typography variant="h5" sx={{ fontWeight: 800 }}>ML</Typography><Typography variant="caption" color="text.secondary">Predictive</Typography></Grid>
              <Grid item xs={4}><Typography variant="h5" sx={{ fontWeight: 800 }}>Secure</Typography><Typography variant="caption" color="text.secondary">Cloud</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;

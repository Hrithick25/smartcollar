import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Button, Avatar } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RadialGauge from '@/components/charts/RadialGauge';
import BehaviorTrendChart from '@/components/charts/BehaviorTrendChart';
import { db, ref, onValue, push } from '@/firebase';

const defaultProfile = {
  name: 'Pet',
  type: 'Dog',
  breed: 'Unknown',
  age: 'N/A',
  gender: 'Unknown',
  image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop'
};

const StatCard = ({ title, value, color = 'primary', status }) => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5, color: 'text.primary' }}>{value}</Typography>
      {status && <Chip size="small" label={status} color={color} variant="outlined" />}
    </CardContent>
  </Card>
);

const NavTile = ({ title, description, to }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(to)} sx={{ p: 2, borderRadius: 3, cursor: 'pointer', '&:hover': { boxShadow: 8 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Card>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const { user, selectedDog } = useAuth();
  const navigate = useNavigate();
  const [heartRate, setHeartRate] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [behavior, setBehavior] = useState('Neutral');

  useEffect(() => {
    const savedProfile = localStorage.getItem('selectedProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const analyzeHeartRate = (bpm, history) => {
    let status = '';
    if (bpm > 160) status = 'Critical';
    else if (bpm > 120) status = 'Elevated';
    else status = 'Normal';

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAlert = `${time} • Heart rate ${status.toLowerCase()}`;
    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);

    const recent = history.slice(-10);
    const avg = recent.reduce((a, b) => a + b.bpm, 0) / Math.max(recent.length, 1);
    if (avg > 140) setBehavior('Anxious');
    else if (avg < 90) setBehavior('Calm');
    else setBehavior('Playful');
  };

  useEffect(() => {
    const hrRef = ref(db, 'heartRateHistory');
    const unsubscribe = onValue(hrRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const values = Object.values(data);
        const sorted = values.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        setTrendData(sorted);
        const latest = sorted[sorted.length - 1];
        if (latest) {
          setHeartRate(latest.bpm);
          analyzeHeartRate(latest.bpm, sorted);
        }
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const active = selectedDog || user || {};
  const dogId = profile?.id || active?.dogId || '-';
  const dogName = profile?.name || active?.name || 'Your Dog';
  const dogPhoto = profile?.image || active?.photo;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto', width: '100%' }}>
      {/* Welcome */}
      <Card sx={{ mb: 3, borderRadius: 5, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {dogPhoto && (
              <Box component="img" src={dogPhoto} alt={dogName} sx={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', boxShadow: 1 }} />
            )}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>Welcome, {profile.name}!</Typography>
              <Typography variant="body2" color="text.secondary">ID: {dogId}</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={() => window.location.hash = '#alerts'} size="large">View Alerts</Button>
        </CardContent>
      </Card>

      

      {/* Quick stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Heart Rate" value={`${heartRate || 0} BPM`} color={heartRate > 120 ? 'warning' : 'success'} status={heartRate > 120 ? 'Elevated' : 'Normal'} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Last Vaccination" value="Aug 10, 2025" status="Up-to-date" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Behavior" value={behavior} color={behavior === 'Anxious' ? 'error' : 'info'} status={behavior === 'Anxious' ? 'Monitoring' : 'Stable'} />
        </Grid>
      </Grid>

      {/* Gauges row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Current Stress Level</Typography>
              <RadialGauge value={68} label="Stress" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>Activity Level</Typography>
              <RadialGauge value={54} label="Activity" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation tiles */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <NavTile title="Medical Records" description="Vaccinations, history, meds" to="/medical" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <NavTile title="Behavior Analysis" description="AI insights and trends" to="/behavior" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <NavTile title="Live Heart Rate" description="Real-time monitoring" to="/heartrate" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Behavior Trend */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Weekly Behavior Trend</Typography>
          <BehaviorTrendChart data={trendData.map((entry) => ({
            date: new Date(Number(entry.timestamp)).toISOString().slice(0, 10),
            dominant: entry.bpm > 140 ? 'Anxious' : entry.bpm < 90 ? 'Calm' : 'Playful',
            incidents: 0,
          }))} />
        </CardContent>
      </Card>

      {/* Recent alerts */}
      <Card id="alerts" sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recent Alerts</Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {alerts.map((alert, i) => (
              <Chip key={i} color={i === 0 ? 'warning' : 'info'} label={alert} sx={{ fontSize: '0.9rem' }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;

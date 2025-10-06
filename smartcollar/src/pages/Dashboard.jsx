import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RadialGauge from '@/components/charts/RadialGauge';
import BehaviorTrendChart from '@/components/charts/BehaviorTrendChart';

const StatCard = ({ title, value, color = 'primary', status }) => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>{value}</Typography>
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

// Weather widget removed per requirements

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 1 }}>
      {/* Welcome */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Dog ID</Typography>
            <Typography variant="body1" color="text.primary">{user?.dogId || '-'}</Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={() => window.location.hash = '#alerts'}>View Alerts</Button>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Heart Rate" value="145 BPM" color="warning" status="Elevated" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Last Vaccination" value="Aug 10, 2025" status="Up-to-date" /></Grid>
        <Grid item xs={12} sm={6} md={4}><StatCard title="Behavior" value="Anxious" color="error" status="Monitoring" /></Grid>
      </Grid>

      {/* Gauges row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Current Stress Level</Typography>
              <RadialGauge value={68} label="Stress" />
            </CardContent>
          </Card>
        </Grid>
        {/* Battery gauge removed */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Activity Level</Typography>
              <RadialGauge value={54} label="Activity" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation tiles (Dog Profiles and Weather removed) */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><NavTile title="Medical Records" description="Vaccinations, history, meds" to="/medical" /></Grid>
            <Grid item xs={12} sm={4}><NavTile title="Behavior Analysis" description="AI insights and trends" to="/behavior" /></Grid>
            <Grid item xs={12} sm={4}><NavTile title="Live Heart Rate" description="Real-time monitoring" to="/heartrate" /></Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Behavior Trend */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Weekly Behavior Trend</Typography>
          <BehaviorTrendChart data={[
            { date: '2025-09-16', dominant: 'Calm', incidents: 0 },
            { date: '2025-09-17', dominant: 'Neutral', incidents: 1 },
            { date: '2025-09-18', dominant: 'Playful', incidents: 0 },
            { date: '2025-09-19', dominant: 'Playful', incidents: 0 },
            { date: '2025-09-20', dominant: 'Anxious', incidents: 2 },
          ]} />
        </CardContent>
      </Card>

      {/* Recent alerts */}
      <Card id="alerts" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Recent Alerts</Typography>
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Chip color="warning" label="3:02 PM • Elevated heart rate detected" />
            <Chip color="error" label="2:45 PM • Ultrasonic calming activated" />
            <Chip color="info" label="1:10 PM • Routine check completed" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;

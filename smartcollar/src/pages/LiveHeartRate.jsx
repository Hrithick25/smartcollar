import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid, Button } from '@mui/material';
import HeartRateChart from '@/components/charts/HeartRateChart';
import { db, ref, onValue } from '@/firebase';  // <-- Import Firebase

const getStatus = (bpm) => {
  if (bpm >= 160) return { color: 'error', text: 'Critical' };
  if (bpm >= 120) return { color: 'warning', text: 'Elevated' };
  return { color: 'success', text: 'Normal' };
};

const LiveHeartRate = () => {
  const [bpm, setBpm] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const hrRef = ref(db, 'heartRate'); // path from Firebase

    // Subscribe to live changes
    onValue(hrRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newBpm = data.bpm;
        const timestamp = Date.now();
        setBpm(newBpm);
        setLastUpdate(new Date().toLocaleTimeString());

        // Add to chart history (keep last 60 readings)
        setHistory((prev) => [...prev.slice(-59), { t: timestamp, v: newBpm }]);
      }
    });
  }, []);

  const status = bpm !== null ? getStatus(bpm) : { color: 'default', text: 'Loading...' };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 }, width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Live Heart Rate</Typography>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Current BPM</Typography>
              <Typography variant="h2" sx={{ fontWeight: 900 }}>
                {bpm !== null ? bpm : '--'}
              </Typography>
              <Chip label={status.text} color={status.color} />
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }} color="text.secondary">
                Status ranges: Normal 60–120 • Elevated 120–160 • Critical 160+
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Collar Status</Typography>
              <Typography variant="body2">Connection: {bpm ? 'Online' : 'Offline'}</Typography>
              <Typography variant="body2">Last data: {lastUpdate || 'Waiting...'}</Typography>
              <Button sx={{ mt: 1 }} variant="outlined">Trigger Calming Sound</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Real-time Graph</Typography>
              <HeartRateChart data={history} />
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Alert: Elevated HR at 3:02 PM" color="warning" />
                <Chip label="Auto Response: Calming sound" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiveHeartRate;

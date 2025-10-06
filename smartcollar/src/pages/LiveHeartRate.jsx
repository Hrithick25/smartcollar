import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid, Button } from '@mui/material';
import HeartRateChart from '@/components/charts/HeartRateChart';

const getStatus = (bpm) => {
  if (bpm >= 160) return { color: 'error', text: 'Critical' };
  if (bpm >= 120) return { color: 'warning', text: 'Elevated' };
  return { color: 'success', text: 'Normal' };
};

const LiveHeartRate = () => {
  const [bpm, setBpm] = useState(110);
  const [history, setHistory] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setBpm((prev) => {
        const delta = Math.round((Math.random() - 0.5) * 10);
        const next = Math.max(60, Math.min(180, prev + delta));
        setHistory((h) => [...h.slice(-60), { t: Date.now(), v: next }]);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, []);

  const status = getStatus(bpm);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Live Heart Rate</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Current BPM</Typography>
              <Typography variant="h2" sx={{ fontWeight: 900 }}>{bpm}</Typography>
              <Chip label={status.text} color={status.color} />
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }} color="text.secondary">
                Status ranges: Normal 60-120 • Elevated 120-160 • Critical 160+
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, mt: 2 }}>
            <CardContent>
              <Typography variant="h6">Collar Status</Typography>
              <Typography variant="body2">Battery: 72%</Typography>
              <Typography variant="body2">Connection: Online</Typography>
              <Typography variant="body2">Last data: {new Date().toLocaleTimeString()}</Typography>
              <Typography variant="body2">GPS: 12.9716, 77.5946</Typography>
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

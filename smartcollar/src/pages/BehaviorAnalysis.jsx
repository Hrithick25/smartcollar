import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import RadialGauge from '@/components/charts/RadialGauge';
import BehaviorTrendChart from '@/components/charts/BehaviorTrendChart';
import { useEffect, useMemo, useRef, useState } from 'react';
import { db, ref, onValue } from '@/firebase';

const BehaviorAnalysis = () => {
  const [bpm, setBpm] = useState(null);
  const [avgBpm, setAvgBpm] = useState(null);
  const [status, setStatus] = useState('—');
  const [statusColor, setStatusColor] = useState('default');
  const [logs, setLogs] = useState([]);
  const bufferRef = useRef([]); // recent BPMs for moving average
  const lastClassRef = useRef(null);

  const classify = (value) => {
    if (value == null) return { label: '—', color: 'default' };
    if (value > 180) return { label: 'Critical', color: 'error' };
    if (value >= 151) return { label: 'Anxious', color: 'error' };
    if (value >= 121) return { label: 'Active', color: 'warning' };
    if (value >= 60) return { label: 'Steady', color: 'success' };
    if (value < 60) return { label: 'Abnormal', color: 'warning' };
    return { label: '—', color: 'default' };
  };

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs((prev) => [{ time, message }, ...prev].slice(0, 25));
  };

  useEffect(() => {
    const hrRef = ref(db, 'heartRate/bpm');
    const unsub = onValue(hrRef, (snap) => {
      const raw = snap.val();
      const reading = typeof raw === 'number' ? raw : Number(raw);

      // Basic sanity checks and spike filtering
      if (!reading || isNaN(reading)) return; // ignore null/0/NaN
      if (reading < 30 || reading > 250) return; // unrealistic

      const buf = bufferRef.current;
      const last = buf.length ? buf[buf.length - 1] : null;
      // Ignore sudden spikes (>60 BPM jump) once
      if (last != null && Math.abs(reading - last) > 60) return;

      const next = [...buf.slice(-4), reading]; // keep last 5
      bufferRef.current = next;

      const average = Math.round(next.reduce((a, b) => a + b, 0) / next.length);
      setBpm(reading);
      setAvgBpm(average);

      const cls = classify(average);
      setStatus(cls.label);
      setStatusColor(cls.color);

      if (lastClassRef.current !== cls.label) {
        const promptMap = {
          Steady: '🟢 Calm/Steady — within normal range',
          Active: '🟡 Active/Excited — elevated BPM',
          Anxious: '🔴 Anxious/Stressed — very high BPM',
          Critical: '⚠️ Critical — possible abnormal reading or panic',
          Abnormal: '⚠️ Abnormal/Sensor Error — unrealistic or low reading',
        };
        addLog(`${promptMap[cls.label] || 'State changed'}`);
        lastClassRef.current = cls.label;
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const confidence = useMemo(() => {
    const buf = bufferRef.current;
    if (buf.length < 2) return 50;
    const mean = buf.reduce((a, b) => a + b, 0) / buf.length;
    const variance = buf.reduce((a, b) => a + (b - mean) * (b - mean), 0) / buf.length;
    const std = Math.sqrt(variance);
    // Map lower variability to higher confidence
    const score = Math.max(0, Math.min(100, Math.round(100 - (std / 30) * 100)));
    return score;
  }, [avgBpm]);

  const trendData = useMemo(() => {
    // Aggregate last logs by day and map to chart format
    const byDay = new Map();
    logs.slice().reverse().forEach((l) => {
      const d = new Date();
      const key = d.toISOString().slice(0, 10);
      byDay.set(key, l.message.includes('Anxious') ? 'Anxious' : l.message.includes('Active') ? 'Playful' : l.message.includes('Steady') ? 'Calm' : 'Neutral');
    });
    return Array.from(byDay.entries()).map(([date, dominant]) => ({ date, dominant, incidents: 0 }));
  }, [logs]);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 }, width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Behavior Analysis</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{status}</Typography>
              <Chip label={`Heart Rate: ${avgBpm ?? bpm ?? '--'} BPM`} color={statusColor} />
              <Box sx={{ mt: 1 }}>
                <RadialGauge value={confidence} label="Confidence" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>ML Predictive Analysis</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Static preview of an ML pipeline that learns behavioral patterns from signals like heart-rate variability,
                motion intensity, rest cycles, and historical events.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Model</Typography>
                  <Typography variant="body2">Gradient Boosting Classifier (offline-trained)</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Features</Typography>
                  <Typography variant="body2">HR mean/variance, HRV, steps/min, rest ratio, event count</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Predicted State</Typography>
                  <Typography variant="body2">{status}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Confidence</Typography>
                  <Typography variant="body2">{confidence}%</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">1h Risk Forecast</Typography>
                  <Typography variant="body2">Low probability of escalation; likely return to baseline after rest</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Historical Trends</Typography>
              <BehaviorTrendChart data={trendData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Incident Reports</Typography>
          <Box sx={{ display: 'grid', gap: 1 }}>
            {logs.length === 0 && (
              <Typography variant="body2" color="text.secondary">Waiting for live data...</Typography>
            )}
            {logs.map((l, i) => (
              <Chip key={i} label={`${l.time} • ${l.message}`} color={i === 0 ? 'warning' : 'info'} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BehaviorAnalysis;

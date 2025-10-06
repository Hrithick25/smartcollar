import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import { behaviorData } from '@/data/dummy';
import RadialGauge from '@/components/charts/RadialGauge';
import BehaviorTrendChart from '@/components/charts/BehaviorTrendChart';

const BehaviorAnalysis = () => {
  const current = behaviorData.current;
  const pct = Math.round(current.confidence * 100);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Behavior Analysis</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{current.status}</Typography>
              <Chip label={`Heart Rate: ${current.heartRate} BPM`} color={current.heartRate > 160 ? 'error' : current.heartRate > 120 ? 'warning' : 'success'} />
              <Box sx={{ mt: 1 }}>
                <RadialGauge value={pct} label="Confidence" />
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
                  <Typography variant="body2">Mild Stress</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Confidence</Typography>
                  <Typography variant="body2">78%</Typography>
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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Historical Trends</Typography>
              <BehaviorTrendChart data={behaviorData.history} />
            </CardContent>
          </Card>
        </Grid>
        {/* Recommendations block removed per request */}
      </Grid>

      <Card sx={{ borderRadius: 3, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Incident Reports</Typography>
          <Typography variant="body2" color="text.secondary">Detailed logs with timestamps and correlating heart rate (placeholder)</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BehaviorAnalysis;

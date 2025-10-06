import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Fab,
  Badge,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';

import { apiService } from '@/services/api';
import { useWebSocket, useInterventionAlerts } from '@/hooks/useWebSocket';
import { useDogs } from '@/hooks/useDogs';
import DogCard from './DogCard';
import StatsCard from './StatsCard';
import RecentInterventions from './RecentInterventions';
import AggressionChart from './AggressionChart';
import HealthMetricsChart from './HealthMetricsChart';
import { DashboardAnalytics } from '@/types';

const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const { isConnected } = useWebSocket();
  const { alerts, clearAlerts } = useInterventionAlerts();
  const { dogs, isLoading: dogsLoading, refetch: refetchDogs } = useDogs();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery<DashboardAnalytics>(
    'dashboard-analytics',
    () => apiService.getDashboardAnalytics(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10 seconds
    }
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchDogs(), refetchAnalytics()]);
      setNotification({
        open: true,
        message: 'Dashboard refreshed successfully',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to refresh dashboard',
        severity: 'error',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const getConnectionStatus = () => {
    if (isConnected) {
      return { color: 'success', icon: <CheckCircleIcon />, text: 'Connected' };
    }
    return { color: 'error', icon: <ErrorIcon />, text: 'Disconnected' };
  };

  const connectionStatus = getConnectionStatus();

  if (analyticsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dog Collar Monitoring Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={connectionStatus.icon}
              label={connectionStatus.text}
              color={connectionStatus.color as any}
              variant="outlined"
            />
            {alerts.length > 0 && (
              <Badge badgeContent={alerts.length} color="error">
                <Chip
                  icon={<WarningIcon />}
                  label={`${alerts.length} Active Alerts`}
                  color="error"
                  variant="filled"
                />
              </Badge>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Dashboard">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton color="primary">
              <Badge badgeContent={alerts.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Dogs"
            value={analytics?.total_dogs || 0}
            icon={<InfoIcon />}
            color="primary"
            trend={dogs.length > 0 ? '+2' : '0'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Collars"
            value={analytics?.active_collars || 0}
            icon={<CheckCircleIcon />}
            color="success"
            trend={analytics?.active_collars ? '+1' : '0'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Interventions Today"
            value={analytics?.interventions_today || 0}
            icon={<WarningIcon />}
            color="warning"
            trend={analytics?.interventions_today ? '+3' : '0'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Aggression Level"
            value={analytics?.avg_aggression_level?.toFixed(1) || '0.0'}
            icon={<WarningIcon />}
            color="error"
            trend={analytics?.avg_aggression_level ? '-0.2' : '0'}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aggression Trends (Last 7 Days)
              </Typography>
              <AggressionChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Metrics
              </Typography>
              <HealthMetricsChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dogs Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Monitored Dogs ({dogs.length})
            </Typography>
          </Box>
        </Grid>
        {dogsLoading ? (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        ) : (
          <AnimatePresence>
            {dogs.map((dog, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DogCard dog={dog} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        )}
      </Grid>

      {/* Recent Interventions */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RecentInterventions interventions={analytics?.recent_interventions || []} />
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add dog"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;

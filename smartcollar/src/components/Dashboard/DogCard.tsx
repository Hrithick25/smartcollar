import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  BatteryFull as BatteryIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Dog, DogStatus } from '@/types';

interface DogCardProps {
  dog: Dog;
  onClick?: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onClick }) => {
  const getDogStatus = (): { status: DogStatus; color: string; icon: React.ReactNode } => {
    // This would be determined by real-time sensor data
    // For now, we'll simulate based on some criteria
    if (!dog.is_active) {
      return { status: 'offline', color: 'grey', icon: <WifiOffIcon /> };
    }
    
    // Simulate status based on dog data
    const randomStatus = Math.random();
    if (randomStatus < 0.1) {
      return { status: 'critical', color: 'error', icon: <ErrorIcon /> };
    } else if (randomStatus < 0.3) {
      return { status: 'warning', color: 'warning', icon: <WarningIcon /> };
    } else {
      return { status: 'healthy', color: 'success', icon: <CheckCircleIcon /> };
    }
  };

  const getBatteryLevel = (): number => {
    // Simulate battery level
    return Math.floor(Math.random() * 100);
  };

  const getConnectionStatus = (): { online: boolean; signal: number } => {
    // Simulate connection status
    return {
      online: Math.random() > 0.2,
      signal: Math.floor(Math.random() * 100)
    };
  };

  const dogStatus = getDogStatus();
  const batteryLevel = getBatteryLevel();
  const connection = getConnectionStatus();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: onClick ? 'pointer' : 'default',
          border: dogStatus.status === 'critical' ? '2px solid' : '1px solid',
          borderColor: dogStatus.status === 'critical' ? 'error.main' : 'divider',
          position: 'relative',
          overflow: 'visible',
        }}
        onClick={onClick}
      >
        {/* Status Indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Tooltip title={`Status: ${dogStatus.status}`}>
            <Chip
              icon={dogStatus.icon}
              label={dogStatus.status}
              color={dogStatus.color as any}
              size="small"
              variant="filled"
            />
          </Tooltip>
        </Box>

        {/* Dog Photo */}
        <CardMedia
          component="img"
          height="200"
          image={dog.photo_url || '/api/placeholder/300/200'}
          alt={dog.name}
          sx={{
            objectFit: 'cover',
            filter: dogStatus.status === 'offline' ? 'grayscale(100%)' : 'none',
          }}
        />

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Dog Name and Breed */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {dog.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dog.breed || 'Mixed Breed'} • {dog.age_years || 'Unknown'} years
            </Typography>
          </Box>

          {/* Status Information */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {dog.gps_latitude ? 'GPS Active' : 'Location Unknown'}
              </Typography>
            </Box>

            {/* Battery Level */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BatteryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={batteryLevel}
                  color={batteryLevel > 20 ? 'success' : 'error'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {batteryLevel}%
              </Typography>
            </Box>

            {/* Connection Status */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {connection.online ? (
                <WifiIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
              ) : (
                <WifiOffIcon sx={{ fontSize: 16, mr: 1, color: 'error.main' }} />
              )}
              <Typography variant="body2" color="text.secondary">
                {connection.online ? `Signal: ${connection.signal}%` : 'Offline'}
              </Typography>
            </Box>
          </Box>

          {/* Additional Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {dog.sex && (
                <Chip
                  label={dog.sex}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
              {dog.sterilization_status && (
                <Chip
                  label={dog.sterilization_status === 'STERILIZED' ? 'Sterilized' : 'Not Sterilized'}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>
            <Avatar sx={{ width: 24, height: 24, bgcolor: dogStatus.color + '.main' }}>
              <Typography variant="caption" sx={{ fontSize: 10 }}>
                {dog.name.charAt(0)}
              </Typography>
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DogCard;

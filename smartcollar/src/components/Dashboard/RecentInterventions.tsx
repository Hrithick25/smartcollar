import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  VolumeUp as VolumeIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Intervention, InterventionType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentInterventionsProps {
  interventions: Intervention[];
}

const RecentInterventions: React.FC<RecentInterventionsProps> = ({ interventions }) => {
  const getInterventionIcon = (type: InterventionType) => {
    switch (type) {
      case 'CRITICAL':
        return <ErrorIcon color="error" />;
      case 'HIGH':
        return <WarningIcon color="warning" />;
      case 'MEDIUM':
        return <InfoIcon color="info" />;
      case 'LOW':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon />;
    }
  };

  const getInterventionColor = (type: InterventionType) => {
    switch (type) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const getInterventionSeverity = (type: InterventionType) => {
    switch (type) {
      case 'CRITICAL':
        return 'Critical';
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  if (interventions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Recent Interventions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All dogs are behaving normally. No interventions have been triggered in the last 24 hours.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Recent Interventions ({interventions.length})
          </Typography>
          <Button size="small" variant="outlined">
            View All
          </Button>
        </Box>

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {interventions.map((intervention, index) => (
            <motion.div
              key={intervention.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  py: 2,
                  px: 0,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: intervention.is_acknowledged ? 'action.hover' : 'background.paper',
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: `${getInterventionColor(intervention.intervention_type)}.main`,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getInterventionIcon(intervention.intervention_type)}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" component="span">
                        Dog ID: {intervention.dog_id}
                      </Typography>
                      <Chip
                        label={getInterventionSeverity(intervention.intervention_type)}
                        color={getInterventionColor(intervention.intervention_type) as any}
                        size="small"
                      />
                      {intervention.is_acknowledged && (
                        <Chip
                          label="Acknowledged"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDistanceToNow(new Date(intervention.triggered_at), { addSuffix: true })}
                          </Typography>
                        </Box>
                        {intervention.ultrasonic_frequency && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VolumeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {intervention.ultrasonic_frequency}Hz
                            </Typography>
                          </Box>
                        )}
                        {intervention.duration_seconds && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {intervention.duration_seconds}s
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      {intervention.aggression_level && (
                        <Typography variant="body2" color="text.secondary">
                          Aggression Level: {intervention.aggression_level} 
                          {intervention.confidence && ` (${(intervention.confidence * 100).toFixed(1)}% confidence)`}
                        </Typography>
                      )}

                      {intervention.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Notes: {intervention.notes}
                        </Typography>
                      )}
                    </Box>
                  }
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {!intervention.is_acknowledged && (
                    <Tooltip title="Acknowledge Intervention">
                      <IconButton size="small" color="primary">
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <LocationIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>

              {index < interventions.length - 1 && <Divider sx={{ my: 1 }} />}
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentInterventions;

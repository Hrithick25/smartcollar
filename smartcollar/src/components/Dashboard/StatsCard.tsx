import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
}) => {
  const isPositiveTrend = trend?.startsWith('+');
  const isNegativeTrend = trend?.startsWith('-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}.main 0%, ${color}.dark 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {value}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 48,
                height: 48,
              }}
            >
              {icon}
            </Avatar>
          </Box>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositiveTrend ? (
                <TrendingUp sx={{ fontSize: 16 }} />
              ) : isNegativeTrend ? (
                <TrendingDown sx={{ fontSize: 16 }} />
              ) : null}
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {trend} from yesterday
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Decorative background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0,
          }}
        />
      </Card>
    </motion.div>
  );
};

export default StatsCard;

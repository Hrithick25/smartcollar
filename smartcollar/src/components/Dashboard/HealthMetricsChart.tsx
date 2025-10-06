import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
} from 'recharts';
import { Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { apiService } from '@/services/api';

const HealthMetricsChart: React.FC = () => {
  const [selectedDog, setSelectedDog] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(7);

  // Mock data for demonstration
  const mockData = [
    { 
      time: '00:00', 
      heart_rate: 85, 
      temperature: 38.5, 
      stress: 5.2,
      avg_heart_rate: 85,
      avg_temperature: 38.5,
      avg_stress: 5.2
    },
    { 
      time: '04:00', 
      heart_rate: 78, 
      temperature: 38.2, 
      stress: 4.8,
      avg_heart_rate: 81,
      avg_temperature: 38.3,
      avg_stress: 5.0
    },
    { 
      time: '08:00', 
      heart_rate: 95, 
      temperature: 38.8, 
      stress: 6.5,
      avg_heart_rate: 86,
      avg_temperature: 38.5,
      avg_stress: 5.4
    },
    { 
      time: '12:00', 
      heart_rate: 88, 
      temperature: 38.6, 
      stress: 5.8,
      avg_heart_rate: 86,
      avg_temperature: 38.5,
      avg_stress: 5.5
    },
    { 
      time: '16:00', 
      heart_rate: 92, 
      temperature: 38.9, 
      stress: 6.2,
      avg_heart_rate: 87,
      avg_temperature: 38.6,
      avg_stress: 5.7
    },
    { 
      time: '20:00', 
      heart_rate: 87, 
      temperature: 38.7, 
      stress: 5.5,
      avg_heart_rate: 87,
      avg_temperature: 38.6,
      avg_stress: 5.6
    },
  ];

  const { data: dogs } = useQuery('dogs', () => apiService.getDogs());

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            boxShadow: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: entry.color,
                  borderRadius: '50%',
                }}
              />
              <Typography variant="body2">
                {entry.name}: {entry.value} {entry.dataKey.includes('rate') ? 'BPM' : entry.dataKey.includes('temperature') ? '°C' : 'μg/dL'}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  const getHealthStatus = (metric: string, value: number) => {
    const thresholds = {
      heart_rate: { normal: [60, 120], warning: [50, 140] },
      temperature: { normal: [37.5, 39.5], warning: [37, 40] },
      stress: { normal: [0, 8], warning: [0, 12] },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'normal';

    if (value >= threshold.normal[0] && value <= threshold.normal[1]) {
      return 'normal';
    } else if (value >= threshold.warning[0] && value <= threshold.warning[1]) {
      return 'warning';
    } else {
      return 'critical';
    }
  };

  const latestData = mockData[mockData.length - 1];

  return (
    <Box>
      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Dog</InputLabel>
          <Select
            value={selectedDog}
            label="Dog"
            onChange={(e) => setSelectedDog(e.target.value)}
          >
            <MenuItem value="all">All Dogs</MenuItem>
            {dogs?.map((dog) => (
              <MenuItem key={dog.id} value={dog.id}>
                {dog.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value as number)}
          >
            <MenuItem value={1}>Last 24 Hours</MenuItem>
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={30}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="#666"
            fontSize={12}
            label={{ value: 'Heart Rate (BPM)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#666"
            fontSize={12}
            label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="heart_rate"
            stroke="#2196f3"
            strokeWidth={2}
            dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            name="Heart Rate"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="temperature"
            stroke="#ff9800"
            strokeWidth={2}
            dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
            name="Temperature"
          />
          <Bar
            yAxisId="left"
            dataKey="stress"
            fill="#f44336"
            fillOpacity={0.6}
            name="Stress Level"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Health Status Indicators */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Health Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`Heart Rate: ${latestData?.heart_rate} BPM`}
            color={getHealthStatus('heart_rate', latestData?.heart_rate || 0) === 'normal' ? 'success' : 
                   getHealthStatus('heart_rate', latestData?.heart_rate || 0) === 'warning' ? 'warning' : 'error'}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`Temperature: ${latestData?.temperature}°C`}
            color={getHealthStatus('temperature', latestData?.temperature || 0) === 'normal' ? 'success' : 
                   getHealthStatus('temperature', latestData?.temperature || 0) === 'warning' ? 'warning' : 'error'}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`Stress: ${latestData?.stress} μg/dL`}
            color={getHealthStatus('stress', latestData?.stress || 0) === 'normal' ? 'success' : 
                   getHealthStatus('stress', latestData?.stress || 0) === 'warning' ? 'warning' : 'error'}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      {/* Summary Stats */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <Box>
          <Typography variant="h6" color="primary.main">
            {latestData?.avg_heart_rate || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Avg Heart Rate
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="warning.main">
            {latestData?.avg_temperature || 0}°C
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Avg Temperature
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="error.main">
            {latestData?.avg_stress || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Avg Stress
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HealthMetricsChart;

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
  Area,
  AreaChart,
} from 'recharts';
import { Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { apiService } from '@/services/api';

const AggressionChart: React.FC = () => {
  const [selectedDog, setSelectedDog] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<number>(7);

  // Mock data for demonstration
  const mockData = [
    { date: '2024-01-01', calm: 45, alert: 30, agitated: 15, aggressive: 8, dangerous: 2 },
    { date: '2024-01-02', calm: 42, alert: 32, agitated: 18, aggressive: 6, dangerous: 2 },
    { date: '2024-01-03', calm: 38, alert: 35, agitated: 20, aggressive: 5, dangerous: 2 },
    { date: '2024-01-04', calm: 40, alert: 33, agitated: 17, aggressive: 7, dangerous: 3 },
    { date: '2024-01-05', calm: 43, alert: 31, agitated: 16, aggressive: 8, dangerous: 2 },
    { date: '2024-01-06', calm: 41, alert: 29, agitated: 19, aggressive: 9, dangerous: 2 },
    { date: '2024-01-07', calm: 44, alert: 28, agitated: 18, aggressive: 8, dangerous: 2 },
  ];

  const { data: dogs } = useQuery('dogs', () => apiService.getDogs());

  const getAggressionColor = (level: string) => {
    const colors = {
      calm: '#4caf50',
      alert: '#ff9800',
      agitated: '#ff5722',
      aggressive: '#f44336',
      dangerous: '#9c27b0',
    };
    return colors[level as keyof typeof colors] || '#666';
  };

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
                {entry.dataKey}: {entry.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

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
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Chip label="Calm" size="small" sx={{ bgcolor: getAggressionColor('calm'), color: 'white' }} />
          <Chip label="Alert" size="small" sx={{ bgcolor: getAggressionColor('alert'), color: 'white' }} />
          <Chip label="Agitated" size="small" sx={{ bgcolor: getAggressionColor('agitated'), color: 'white' }} />
          <Chip label="Aggressive" size="small" sx={{ bgcolor: getAggressionColor('aggressive'), color: 'white' }} />
          <Chip label="Dangerous" size="small" sx={{ bgcolor: getAggressionColor('dangerous'), color: 'white' }} />
        </Box>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Area
            type="monotone"
            dataKey="calm"
            stackId="1"
            stroke={getAggressionColor('calm')}
            fill={getAggressionColor('calm')}
            fillOpacity={0.6}
            name="Calm"
          />
          <Area
            type="monotone"
            dataKey="alert"
            stackId="1"
            stroke={getAggressionColor('alert')}
            fill={getAggressionColor('alert')}
            fillOpacity={0.6}
            name="Alert"
          />
          <Area
            type="monotone"
            dataKey="agitated"
            stackId="1"
            stroke={getAggressionColor('agitated')}
            fill={getAggressionColor('agitated')}
            fillOpacity={0.6}
            name="Agitated"
          />
          <Area
            type="monotone"
            dataKey="aggressive"
            stackId="1"
            stroke={getAggressionColor('aggressive')}
            fill={getAggressionColor('aggressive')}
            fillOpacity={0.6}
            name="Aggressive"
          />
          <Area
            type="monotone"
            dataKey="dangerous"
            stackId="1"
            stroke={getAggressionColor('dangerous')}
            fill={getAggressionColor('dangerous')}
            fillOpacity={0.6}
            name="Dangerous"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <Box>
          <Typography variant="h6" color="success.main">
            {mockData[mockData.length - 1]?.calm || 0}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Calm Today
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="warning.main">
            {mockData[mockData.length - 1]?.alert || 0}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Alert Today
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="error.main">
            {(mockData[mockData.length - 1]?.aggressive || 0) + (mockData[mockData.length - 1]?.dangerous || 0)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            High Risk Today
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AggressionChart;

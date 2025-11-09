import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const RadialGauge = ({ value = 76, label = 'Level', colors = ['#00e5ff', '#2962ff'] }) => {
  const theme = useTheme();
  const data = [{ name: label, value, fill: colors[0] }];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        barSize={14}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background dataKey="value" cornerRadius={16} />
        <text
          x="50%"
          y="52%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={theme.palette.text.primary}
          fontSize={24}
          fontWeight="bold"
        >
          {value}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default RadialGauge;

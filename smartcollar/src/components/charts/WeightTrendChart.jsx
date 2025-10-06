import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WeightTrendChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({ date: d.date.slice(5), kg: d.kg }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#64ffda" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#00bfa5" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 'dataMax + 2']} />
        <Tooltip formatter={(v) => [`${v} kg`, 'Weight']} labelStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="kg" stroke="#00e5c1" fill="url(#weightGradient)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WeightTrendChart;

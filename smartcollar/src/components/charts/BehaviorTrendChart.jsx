import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const moodValue = (mood) => {
  switch ((mood || '').toLowerCase()) {
    case 'playful':
      return 80;
    case 'calm':
      return 70;
    case 'neutral':
      return 60;
    case 'anxious':
      return 40;
    case 'fearful':
      return 30;
    case 'aggressive':
      return 10;
    default:
      return 50;
  }
};

const BehaviorTrendChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({
    date: d.date?.slice(5),
    score: moodValue(d.dominant),
    incidents: d.incidents,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="behGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffd54f" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#ff6f00" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v, name) => (name === 'score' ? [`${v}`, 'Mood Score'] : [v, 'Incidents'])} labelStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="score" stroke="#ff9100" fill="url(#behGradient)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BehaviorTrendChart;

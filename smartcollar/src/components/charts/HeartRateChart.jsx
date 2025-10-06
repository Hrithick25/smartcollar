import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea } from 'recharts';

const formatTime = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const HeartRateChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({ time: formatTime(d.t), bpm: d.v }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#2962ff" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        {/* Normal range band */}
        <ReferenceArea y1={60} y2={120} fill="#1b5e20" fillOpacity={0.07} ifOverflow="hidden" />
        {/* Elevated range band */}
        <ReferenceArea y1={120} y2={160} fill="#f57f17" fillOpacity={0.06} ifOverflow="hidden" />
        {/* Critical range band */}
        <ReferenceArea y1={160} y2={190} fill="#b71c1c" fillOpacity={0.06} ifOverflow="hidden" />
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[60, 180]} />
        <Tooltip formatter={(v) => [`${v} BPM`, 'Heart Rate']} labelStyle={{ fontSize: 12 }} separator=": " cursor={{ stroke: '#90caf9', strokeWidth: 1 }} />
        <Line type="monotone" dataKey="bpm" stroke="url(#hrGradient)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart;

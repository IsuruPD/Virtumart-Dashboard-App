import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from './StatsCard';

const data = [
  { name: 'Jan', sales: 4000, growth: 2400, amt: 2400 },
  { name: 'Feb', sales: 3000, growth: 1398, amt: 2210 },
  // more data points
];

const Overview = () => {
  return (
    <div className="overview">
      <div className="overviewHeader">
        <h1>Overview</h1>
        <p>Quick view of your store's performance</p>
      </div>
      <div className="statsGrid">
        <StatsCard title="Total Sales" value="$4,000" />
        <StatsCard title="Total Growth" value="24%" />
        <StatsCard title="Gross Products" value="120" />
        <StatsCard title="Net Profit" value="$3,200" />
      </div>
      <div className="chartContainer">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            <Line type="monotone" dataKey="growth" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Overview;

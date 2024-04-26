import React, { PureComponent } from 'react';
import "./chart.scss";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

let title="Monthly Transactions";
const data = [
    { name: "Jan.", Total: 1200 },
    { name: "Feb.", Total: 2100 },
    { name: "Mar.", Total: 800 },
    { name: "Apr.", Total: 1600 },
    { name: "May", Total: 900 },
    { name: "Jun.", Total: 1700 },
    { name: "Jul.", Total: 1700 },
    { name: "Aug.", Total: 3000 },
    { name: "Sep.", Total: 2400 },
    { name: "Oct.", Total: 3200 },
    { name: "Nov.", Total: 3400 },
    { name: "Dec.", Total: 4200 },
  ];

const Chart = ({title}) => {
    return (
      <div className="chart">
        <div className="title">{title}Monthly Turnover</div>
        <ResponsiveContainer width="100%" aspect={2/1}>
          <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}>
              
              <CartesianGrid strokeDasharray="3 3" className='chartGrid'/>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="Total" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
      </ResponsiveContainer>
      </div>
    );
  };
  

export default Chart
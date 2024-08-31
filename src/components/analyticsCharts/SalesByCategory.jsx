import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';

const pieData = [
    { id: 0, value: 10, label: 'Series A' },
    { id: 1, value: 15, label: 'Series B' },
    { id: 2, value: 20, label: 'Series C' },
  ];


const SalesByCategory = () => {
  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Sales By Category</Typography>
      <PieChart
        series={[
        {
            data: pieData,
            innerRadius: 50,
            outerRadius: 180,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 180,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
        ]}
        height={400}
    />
    </div>
  );
};

export default SalesByCategory;

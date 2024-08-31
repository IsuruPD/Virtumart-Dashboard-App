import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';


const topProductsData = [
  { month: 'January', sales: 10000},
  { month: 'February', sales: 15000},
  { month: 'March', sales: 8000},
  { month: 'April', sales: 12000},
  { month: 'May', sales: 9000},
  { month: 'June', sales: 7000},
  { month: 'July', sales: 10000},
  { month: 'August', sales: 15000},
  { month: 'September', sales: 8000},
  { month: 'October', sales: 12000},
  { month: 'November', sales: 9000},
  { month: 'December', sales: 7000},
];

const truncatedData = topProductsData.map(item => ({
  ...item,
  month: item.month.length > 3 ? item.month.substring(0, 3) + '.' : item.month,
}));

const chartSetting = {
  yAxis: [
    {
      label: 'Total (Rs.)',
    },
  ],
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-40px, 0)',
    },
  },
  width: 500,
  height: 400,
};

const TotalSales = () => {
  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Total Sales</Typography>
      <BarChart
        dataset={truncatedData}
        series={[{ dataKey: 'sales', label: 'Sales (Rs.)', topProductsData }]}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'month', 
          categoryGapRatio: 0.5, 
          barGapRatio: 0.5,
          colorMap: {
            type: 'ordinal',
            colors: ['#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e']
          }
        }]}
        margin={{
          top: 50,
          right: 50,
          left: 100,
          bottom: 50,
        }}
        grid={{ horizontal: true }}
        {...chartSetting}
        slotProps={{
          legend: { hidden: true }
        }}
      />
    </div>
  );
};

export default TotalSales;

import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset } from './productSales';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';


const chartSetting = {
  yAxis: [
    {
      label: 'Total (Rs.)',
    },
  ],
  width: 500,
  height: 400,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const valueFormatter = (value) => `${value}mm`;


const TopSellingProducts = () => {
  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Top Selling Products</Typography>
      <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[
            { dataKey: 'Laptop', label: 'Laptop',  },
            { dataKey: 'Desktop', label: 'Desktop',  },
            { dataKey: 'MobilePhone', label: 'Mobile Phone',  },
            { dataKey: 'SmartWatch', label: 'Smart Watch',  },
          ]}
          margin={{
            top: 50,
            right: 50,
            left: 80,
            bottom: 50,
          }}
          {...chartSetting}
        />
    </div>
  );
};

export default TopSellingProducts;

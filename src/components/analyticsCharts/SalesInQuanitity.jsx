import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';

const topProductsData = [
  { product: 'Laptop', sales: 100},
  { product: 'Smartphone', sales: 150},
  { product: 'Headphones', sales: 80},
  { product: 'Tablet', sales: 120},
  { product: 'Monitor', sales: 90},
  { product: 'Keyboard', sales: 70},
];

const truncatedData = topProductsData.map(item => ({
  ...item,
  product: item.product.length > 4 ? item.product.substring(0, 4) + '...' : item.product,
}));

const chartSetting = {
  xAxis: [
    {
      label: 'Quantity',
    },
  ],
  width: 500,
  height: 400,
};

const SalesInQuantity = () => {
  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Total items Sold</Typography>
      <BarChart
        dataset={truncatedData}
        series={[{ dataKey: 'sales', label: 'Sold Items' }]}
        yAxis={[{ scaleType: 'band', dataKey: 'product', categoryGapRatio: 0.5, barGapRatio: 0.5 }]}
        margin={{
          top: 50,
          right: 50,
          left: 100,
          bottom: 50,
        }}
        layout="horizontal"
        grid={{ vertical: true }}
        {...chartSetting}
      />
    </div>
  );
};

export default SalesInQuantity;

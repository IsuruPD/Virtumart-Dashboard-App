import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';

const topProductsData = [
  { product: 'Laptop', sales: 100 },
  { product: 'Smartphone', sales: 150 },
  { product: 'Headphones', sales: 80 },
  // Add more products
];

const TopSellingProducts = () => {
  return (
    <div>
      <Typography variant="h6">Top Selling Products</Typography>
      <BarChart
        dataset={topProductsData}
        series={[{ dataKey: 'sales', label: 'Sales' }]}
        xAxis={[{ scaleType: 'band', dataKey: 'product' }]}
        width={300}
        height={250}
      />
    </div>
  );
};

export default TopSellingProducts;

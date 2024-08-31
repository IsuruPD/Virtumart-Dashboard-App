import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { addLabels, balanceSheet } from './balanceSheet';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';

const chartSetting = {
  yAxis: [
    {
      label: 'Total (Rs.)',
    },
  ],
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-60px, 0)',
    },
  },
  width: 800,
  height: 400,
};

const SalesGrowth = () => {
  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Growth Over the Years</Typography>
      <BarChart
        dataset={balanceSheet}
        series={addLabels([
          { dataKey: 'currAss', stack: 'assets' },
          { dataKey: 'nCurrAss', stack: 'assets' },
          { dataKey: 'curLia', stack: 'liability' },
          { dataKey: 'nCurLia', stack: 'liability' },
          { dataKey: 'capStock', stack: 'equity' },
          { dataKey: 'retEarn', stack: 'equity' },
          { dataKey: 'treas', stack: 'equity' },
        ])}
        xAxis={[{ scaleType: 'band', dataKey: 'year', label: 'Year'}]}
        slotProps={{ legend: { hidden: true } }}
        margin={{
          top: 50,
          right: 50,
          left: 120,
          bottom: 50,
        }}
        {...chartSetting}
      />
    </div>
  );
};

export default SalesGrowth;

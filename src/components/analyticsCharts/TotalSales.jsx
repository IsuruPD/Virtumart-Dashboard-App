import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

// Helper function to get the last 12 months including year
const getLast12Months = () => {
  const months = [];
  const date = new Date();

  for (let i = 11; i >= 0; i--) {
    const month = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'long' });
    const year = month.getFullYear();
    months.push({ month: monthName, year: year, key: `${monthName} ${year}` });
  }

  return months;
};

const TotalSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        const last12Months = getLast12Months();
        let monthlySales = {};

        // Initialize monthlySales for the last 12 months
        last12Months.forEach(({ key }) => {
          monthlySales[key] = 0;
        });

        for (const userDoc of usersSnapshot.docs) {
          const uid = userDoc.id;
          const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
          const userOrdersSnapshot = await getDocs(userOrdersRef);

          userOrdersSnapshot.forEach((userOrderDoc) => {
            const data = userOrderDoc.data();
            const orderDate = data.orderDate;

            const orderYear = new Date(orderDate).getFullYear();
            const orderMonth = new Date(orderDate).toLocaleString('default', { month: 'long' });

            const key = `${orderMonth} ${orderYear}`;

            // Integrate the orderTotal for each month and year
            if (monthlySales[key] !== undefined) {
              monthlySales[key] += data.orderTotal || 0;
            }
          });
        }

        // Convert the data into a format suitable for the BarChart
        const formattedSalesData = last12Months.map(({ month, year, key }) => ({
          month: `${month.substring(0, 3)}`,
          year: year,
          sales: monthlySales[key],
        }));

        setSalesData(formattedSalesData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const chartSetting = {
    yAxis: [
      {
        label: 'Total (Rs.)',
      },
    ],
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-50px, 0)',
      },
    },
    width: 500,
    height: 400,
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto'  }}>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Total Sales (Last 12 Months)</Typography>
      <BarChart
        dataset={salesData}
        series={[{ 
          dataKey: 'sales', 
          label: 'Sales (Rs.)'}]}
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

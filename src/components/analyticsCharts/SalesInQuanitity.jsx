import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

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

const SalesInQuantity = () => {
  const [quantityData, setQuantityData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        const last12Months = getLast12Months();
        let monthlyQuantities = {};

        // Initialize monthlyQuantities for each product in the last 12 months
        last12Months.forEach(({ key }) => {
          monthlyQuantities[key] = {};
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

            // Skip orders that have been cancelled
            if (data.orderStatus === 'Cancelled') {
              return;
            }

            // Iterate over each orderItem in the order
            data.orderItems.forEach((item) => {
              const productName = item.product.productName;
              const quantity = item.quantity;

              if (!monthlyQuantities[key][productName]) {
                monthlyQuantities[key][productName] = 0;
              }

              monthlyQuantities[key][productName] += quantity;
            });
          });
        }

        // Convert the aggregated data into a format suitable for the BarChart
        const formattedQuantityData = last12Months.map(({ month, year, key }) => {
          const productQuantities = monthlyQuantities[key];
          const filteredQuantities = Object.fromEntries(
            Object.entries(productQuantities).filter(([_, quantity]) => quantity > 0)
          );
          return {
            month: `${month.substring(0, 3)}`, // e.g., "Jan"
            ...filteredQuantities,
          };
        });

        setQuantityData(formattedQuantityData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const chartSetting = {
    width: 500,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };

  const uniqueProducts = quantityData.reduce((acc, data) => {
    Object.keys(data).forEach((key) => {
      if (key !== 'month' && !acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, []);

  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', 
  ];

  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Total Items Sold (Last 12 Months)</Typography>
      <BarChart
        dataset={quantityData}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'month',}]}
        yAxis={[{ 
          label: 'Quantity',
          // tickFormat: (value) => Math.round(value) 
        }]}
        series={uniqueProducts.map(product => ({
          dataKey: product,
          label: product,
        }))}
        margin={{
          top: 50,
          right: 50,
          left: 80,
          bottom: 50,
        }}
        grid={{ horizontal: true, vertical: true }}
        slotProps={{
          legend: { hidden: true }
        }}
        {...chartSetting}
      />
    </div>
  );
};

export default SalesInQuantity;
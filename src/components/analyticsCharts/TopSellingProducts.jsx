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

const TopSellingProducts = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        const last12Months = getLast12Months();
        let monthlySales = {};

        // Initialize monthlySales for each product in the last 12 months
        last12Months.forEach(({ key }) => {
          monthlySales[key] = {};
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
              const price = item.product.price;
              const offerPercentage = item.product.offerPercentage || 0;
              const quantity = item.quantity;

              const sales = price * (1 - offerPercentage / 100) * quantity;

              if (!monthlySales[key][productName]) {
                monthlySales[key][productName] = 0;
              }

              monthlySales[key][productName] += sales;
            });
          });
        }

        // Convert the data into a format suitable for the BarChart
        const formattedSalesData = last12Months.map(({ month, year, key }) => {
          const productSales = monthlySales[key];
          const filteredSales = Object.fromEntries(
            Object.entries(productSales).filter(([_, sales]) => sales > 0)
          );
          return {
            month: `${month.substring(0, 3)}`,
            ...filteredSales,
          };
        });

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
    width: 500,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-40px, 0px)',
      },
    },
  };

  const uniqueProducts = salesData.reduce((acc, data) => {
    Object.keys(data).forEach((key) => {
      if (key !== 'month' && !acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, []);

  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Top Selling Products (Last 12 Months)</Typography>
      <BarChart
        dataset={salesData}
        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
        series={uniqueProducts.map(product => ({
          dataKey: product,
          label: `${product}`,
        }))}
        margin={{
          top: 50,
          right: 50,
          left: 80,
          bottom: 50,
        }}
        slotProps={{
          legend: { hidden: true }
        }}
        {...chartSetting}
      />
    </div>
  );
};

export default TopSellingProducts;

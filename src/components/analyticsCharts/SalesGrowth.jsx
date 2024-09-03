import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { axisClasses } from '@mui/x-charts/ChartsAxis';


const SalesGrowth = () => {
  const [barData, setBarData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        let categoryYearSales = {};

        const currentYear = new Date().getFullYear();
        const lastFourYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

        // Initialize the data structure for each year and category
        lastFourYears.forEach((year) => {
          categoryYearSales[year] = {};
        });

        for (const userDoc of usersSnapshot.docs) {
          const uid = userDoc.id;
          const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
          const userOrdersSnapshot = await getDocs(userOrdersRef);

          userOrdersSnapshot.forEach((userOrderDoc) => {
            const data = userOrderDoc.data();
            const orderYear = new Date(data.orderDate).getFullYear();

            // Skip orders that have been cancelled
            if (data.orderStatus === 'Cancelled') {
              return;
            }

            if (orderYear >= currentYear - 3) {
              data.orderItems.forEach((item) => {
                const categoryName = item.product.category;
                const itemTotal = item.product.price * (1 - item.product.offerPercentage) * item.quantity;

                if (!categoryYearSales[orderYear][categoryName]) {
                  categoryYearSales[orderYear][categoryName] = 0;
                }

                categoryYearSales[orderYear][categoryName] += itemTotal;
              });
            }
          });
        }

        // Ensure every category has a 0 value entry for years with no sales
        const allCategories = new Set();
        lastFourYears.forEach((year) => {
          Object.keys(categoryYearSales[year]).forEach((category) => {
            allCategories.add(category);
          });
        });

        allCategories.forEach((category) => {
          lastFourYears.forEach((year) => {
            if (!categoryYearSales[year][category]) {
              categoryYearSales[year][category] = 0;
            }
          });
        });

        // Format data for the bar chart
        const formattedBarData = lastFourYears.map((year) => ({
          year: year.toString(),
          ...categoryYearSales[year],
        })).sort((a, b) => a.year - b.year);;

        setBarData(formattedBarData);
        setCategories(Array.from(allCategories));
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
    width: 800,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-60px, 0px)',
      },
    },
  };

  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Growth Over the Years</Typography>
      <BarChart
        dataset={barData}
        series={categories.map((category) => ({
          dataKey: category,
          stack: 'sales',
          label: category,
        }))}
        xAxis={[{ scaleType: 'band', dataKey: 'year', label: 'Year'}]}
        margin={{
          top: 50,
          right: 0,
          left: 120,
          bottom: 50,
        }}
        {...chartSetting}
      />
    </div>
  );
};

export default SalesGrowth;

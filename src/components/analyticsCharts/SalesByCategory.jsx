import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';
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

const SalesByCategory = () => {
  const [pieData, setPieData] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        const last12Months = getLast12Months();
        let categorySales = {};
        let totalSales = 0;

        for (const userDoc of usersSnapshot.docs) {
          const uid = userDoc.id;
          const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
          const userOrdersSnapshot = await getDocs(userOrdersRef);

          userOrdersSnapshot.forEach((userOrderDoc) => {
            const data = userOrderDoc.data();
            const orderDate = new Date(data.orderDate);
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.toLocaleString('default', { month: 'long' });
            const key = `${orderMonth} ${orderYear}`;

            // Skip orders that have been cancelled
            if (data.orderStatus === 'Cancelled') {
              return;
            }
            
            // Only consider orders from the last 12 months
            if (last12Months.some(month => month.key === key)) {
              totalSales += data.orderTotal; // Sum up the total sales

              // Iterate over each orderItem in the order
              data.orderItems.forEach((item) => {
                const categoryName = item.product.category;
                const itemTotal = item.product.price * (1 - item.product.offerPercentage) * item.quantity;

                if (!categorySales[categoryName]) {
                  categorySales[categoryName] = 0;
                }

                categorySales[categoryName] += itemTotal;
              });
            }
          });
        }

        // Convert categorySales into a format suitable for the PieChart
        const formattedPieData = Object.entries(categorySales).map(([category, sales], index) => {
          const percentage = (sales / totalSales) * 100; // Calculate the percentage

          return {
            id: index,
            value: percentage,
            label: category,
          };
        });

        setPieData(formattedPieData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Typography style={{ paddingTop: '10px', paddingLeft: '10px' }}>Sales By Category</Typography>
      <PieChart
        series={[
          {
            data: pieData,
            innerRadius: 50,
            outerRadius: 180,
            paddingAngle: 1,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
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

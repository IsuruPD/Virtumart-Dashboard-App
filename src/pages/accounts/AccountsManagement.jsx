import React, { useState, useEffect } from 'react';
import "./accountsManagement.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from './StatsCard';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import TotalSalesChart from '../../components/analyticsCharts/TotalSales';
import SalesByCategoryChart from '../../components/analyticsCharts/SalesByCategory';
import TopSellingProducts from '../../components/analyticsCharts/TopSellingProducts';
import SalesInQuantityChart from './../../components/analyticsCharts/SalesInQuanitity';
import SalesGrowth from './../../components/analyticsCharts/SalesGrowth';
import { collection, getDocs, query, where  } from 'firebase/firestore';
import { firestore } from '../../firebase';


const valueFormatter = (value) => `${value}`;

// Helper function to get the last 6 months including year
const getLast6Months = () => {
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

const AccountsManagement = () => {

  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [grossProducts, setGrossProducts] = useState(0);
  const [cancellations, setCancellations] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        const last6Months = getLast6Months();
        let monthlySales = {};

        // Initialize monthlySales for the last 6 months
        last6Months.forEach(({ key }) => {
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

            // Skip orders that have been cancelled
            if (data.orderStatus === 'Cancelled') {
              return;
            }
            
            // Integrate the orderTotal for each month and year
            if (monthlySales[key] !== undefined) {
              monthlySales[key] += data.orderTotal || 0;
            }
          });
        }

        // Convert the data into a format suitable for the LineChart and calculate growth
        const formattedSalesData = last6Months.map(({ month, year, key }, index) => {
          const currentMonthSales = monthlySales[key];
          const previousMonthSales = index > 0 ? monthlySales[last6Months[index - 1].key] : 0;
          const growth = currentMonthSales - previousMonthSales;

          return {
            month: `${month.substring(0, 3)}`,
            year: year,
            sales: currentMonthSales,
            growth: index > 0 ? growth : 0, // No growth for the first month
          };
        });

        setSalesData(formattedSalesData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchCardStats = async () => {
        try {
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            const todayDateStr = today.toISOString().split('T')[0];
            const yesterdayDateStr = yesterday.toISOString().split('T')[0];

            const usersSnapshot = await getDocs(collection(firestore, 'user'));

            let todaySales = 0;
            let todayGrossProducts = 0;
            let todayCancellations = 0;
            let yesterdaySales = 0;

            for (const userDoc of usersSnapshot.docs) {
                const uid = userDoc.id;
                const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');

                // Query for today's orders
                const todayOrdersSnapshot = await getDocs(query(userOrdersRef, where('orderDate', '==', todayDateStr)));
                todayOrdersSnapshot.forEach((doc) => {
                    const data = doc.data();

                    // Calculate total sales (excluding cancelled orders)
                    if (data.orderStatus !== 'Cancelled') {
                        todaySales += data.orderTotal || 0;
                    } else {
                        // Calculate cancellations
                        todayCancellations += data.orderTotal || 0;
                    }

                    // Calculate gross products (total quantity of items purchased)
                    if (Array.isArray(data.orderItems)) {
                        todayGrossProducts += data.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                    }
                });

                // Query for yesterday's orders to calculate growth
                const yesterdayOrdersSnapshot = await getDocs(query(userOrdersRef, where('orderDate', '==', yesterdayDateStr)));
                yesterdayOrdersSnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.orderStatus !== 'Cancelled') {
                        yesterdaySales += data.orderTotal || 0;
                    }
                });
            }

            setTotalSales(todaySales);
            setGrossProducts(todayGrossProducts);
            setCancellations(todayCancellations);

            const growth = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;
            setTotalGrowth(growth);

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    fetchCardStats();
}, []);
  

  return (
    <>
      <div className="accountsManagement">
        <SideBar />
        <div className="accountsManagementContainer">
          
          <NavBar />

          <div className="accountsManagementTitle">
            Accounts Management
          </div> 

          <div className="accountsOverview">
            <div className="overviewHeaderTitle">
              <h1>Overview</h1>
              <p>Quick view of the store's performance</p>
            </div>
            <div className="overviewHeaderContent">
              <div className="statsGrid">
                <StatsCard title="Total Sales" value={`Rs. ${totalSales.toString().length <= 12 ? totalSales : '999,999,999+'}`} />
                <StatsCard title="PNL" value={`${totalGrowth.toFixed(1)}%`} />
                <StatsCard title="Gross Products" value={grossProducts} />
                <StatsCard title="Cancellations" value={`Rs. ${cancellations.toFixed(1)}`} />
              </div>
              <div className="chartContainer">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData} margin={{
                      top: 0,
                      right: 20,
                      left: 20,
                      bottom: 0,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                    <Line type="monotone" dataKey="growth" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="accountsOptions">
            <Container maxWidth="lg">
              {/* Main Analytics Sections */}   
              <div className="accountsOptions1" >            
             
                <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: '600', color: '#404040', }}>Sales Analysis</p>
                  <Link to="reports/" className='chartNav'>
                    <div className="editButton" style={{}}>See More</div>
                  </Link>
                </div>

                <div style={{ paddingTop: '20px', overflowX: 'auto' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper style={{ padding: '10px', overflowX: 'auto' }}>
                        <TotalSalesChart/>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper style={{ padding: '10px', overflowX: 'auto' }}>
                      <SalesByCategoryChart/>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </div> 
              
              {/* Secondary Analytics Sections */}
              <div className="accountsOptions2" >            
             
                <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: '600', color: '#404040', }}>Products Analysis</p>
                  <Link to="reports/" className='chartNav'>
                    <div className="editButton" style={{}}>See More</div>
                  </Link>
                </div>

                <div style={{ paddingTop: '20px', overflowX: 'auto' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper style={{ padding: '20px', overflowX: 'auto' }}>
                        <TopSellingProducts/>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper style={{ padding: '20px', overflowX: 'auto' }}>
                      <SalesInQuantityChart/>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </div>

              {/* Tertiary Analytics Sections */}
              <div className="accountsOptions3" >            
             
                <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: '600', color: '#404040', }}>Growth Analysis</p>
                  <Link to="reports/" className='chartNav'>
                    <div className="editButton" style={{}}>See More</div>
                  </Link>
                </div>

                <div style={{ paddingTop: '20px'}}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                      <Paper style={{ padding: '20px', overflowX: 'auto' }}>
                        <SalesGrowth/>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Container> 
          </div>
      </div>     
    </div>   
  </>
  )
  
}

export default AccountsManagement;
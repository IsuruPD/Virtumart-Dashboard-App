import React, { useState, useEffect } from 'react';
import "./reportGenerationModule.scss";
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { TextField } from '@mui/material';
import { CSVLink } from "react-csv";

const ReportGenerationModule = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [topSales, setTopSales] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Fetch data based on selected dates
  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        let salesData = [];

        for (const userDoc of usersSnapshot.docs) {
          const uid = userDoc.id;
          const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
          const userOrdersSnapshot = await getDocs(userOrdersRef);

          userOrdersSnapshot.forEach((userOrderDoc) => {
            const data = userOrderDoc.data();
            const orderDate = data.orderDate;
            if (new Date(orderDate) >= new Date(startDate) && new Date(orderDate) <= new Date(endDate)) {
              // Skip orders that have been cancelled
              if (data.orderStatus === 'Cancelled') {
                return;
              }
              // Process the order items
              data.orderItems.forEach((item) => {
                salesData.push({
                  productId: item.product.productId,
                  productName: item.product.productName,
                  category: item.product.category,
                  price: item.product.price,
                  quantity: item.quantity,
                  offerPercentage: (item.product.offerPercentage * 100).toFixed(2).concat("%"),
                  totalSales: item.quantity * item.product.price * (1 - (item.product.offerPercentage || 0) / 100),
                  orderDate: orderDate,
                });
              });
            }
          });
        }

        setTopSales(salesData);
        setTableData(salesData); // For displaying in the table
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchTopSelling();
  }, [startDate, endDate]);

  const handleApplyFilters = () => {
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setTopSales([]);
    setTableData([]);
  };

  const csvData = tableData.map((row) => ({
    ProductID: row.productId,
    ProductName: row.productName,
    category: row.category,
    Price: row.price,
    OfferPercentage: row.offerPercentage,
    Quantity: row.quantity,
    TotalSales: row.totalSales,
    OrderDate: row.orderDate,
  }));

  return (
    <>
      <div className="reportsGeneration">
        <SideBar />
        <div className="reportsGenerationContainer">
          <NavBar />
          <div className="reportsGenerationTitle">Reports Generation</div> 
          
          <div className="reportsOverview">
            <div className="overviewHeaderContent">
              <div className="filterPeriodContainer">
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ width: 250}}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ marginLeft: 10, width: 250 }}
                />
                <Button sx={{ marginLeft: 5}} variant="contained" color="primary" onClick={handleApplyFilters} className="applyButton">
                  Apply
                </Button>
                <Button sx={{ marginLeft: 5}} variant="contained" color="primary" onClick={handleResetFilters} className="resetButton">
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          <div className="reportsOptions">
            <Container maxWidth="lg">
              <div className="reportsOptions1">
                <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: '600', color: '#404040' }}>Sales Analysis</p>
                </div>
                <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div></div>
                <Box mt={3}>
                  <Button variant="contained" color="primary">
                    <CSVLink data={csvData} filename={"sales-report.csv"} style={{ color: 'white', textDecoration: 'none' }}>
                      Export to CSV
                    </CSVLink>
                  </Button>
                </Box>
                </div>
                

                {/* Table to display product records */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Id</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price (Rs.)</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Total Sales (Rs.)</TableCell>
                        <TableCell>Order Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.productId}</TableCell>
                          <TableCell>{row.productName}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.price}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>{row.totalSales}</TableCell>
                          <TableCell>{row.orderDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div> 
            </Container> 
          </div>
        </div>
      </div>   
    </>
  );
};

export default ReportGenerationModule;

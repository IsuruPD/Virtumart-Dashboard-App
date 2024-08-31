import React from 'react';
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


const data = [
  { name: 'Jan', sales: 4000, growth: 2400, amt: 2400 },
  { name: 'Feb', sales: 3000, growth: 1398, amt: 2210 },
  { name: 'Mar', sales: 5000, growth: 1234, amt: 3453 },
  { name: 'Apr', sales: 7000, growth: 3243, amt: 1231 },
  { name: 'May', sales: 100000, growth: 41398, amt: 2343 },
  { name: 'June', sales: 2000, growth: 2325, amt: 2341 },
];

const pieData = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
];

const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
    },
  ],
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const valueFormatter = (value) => `${value}mm`;

const AccountsManagement = () => {

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
                <StatsCard title="Total Sales" value="Rs. 4,000" />
                <StatsCard title="Total Growth" value="24%" />
                <StatsCard title="Gross Products" value="120" />
                <StatsCard title="Net Profit" value="Rs. 3,200" />
              </div>
              <div className="chartContainer">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
                  <Link to="/customerManagementApp" className='chartNav'>
                    <div className="editButton" style={{}}>See More</div>
                  </Link>
                </div>

                <div style={{ paddingTop: '20px'}}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper>
                        <TotalSalesChart/>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper>
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
                  <Link to="/customerManagementApp" className='chartNav'>
                    <div className="editButton" style={{}}>See More</div>
                  </Link>
                </div>

                <div style={{ paddingTop: '20px'}}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper>
                        <TopSellingProducts/>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Paper>
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
                  <Link to="/customerManagementApp" className='chartNav'>
                    <div className="editButton" style={{}}>See More</div>
                  </Link>
                </div>

                <div style={{ paddingTop: '20px'}}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                      <Paper>
                        <SalesGrowth/>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Container> 
          </div>

          {/* <div className="accountsHeadContainer">
            <div className="overview">              
              <div className="pieChartContainer">
                <PieChart
                  series={[
                    {
                      data: pieData,
                      innerRadius: 50,
                      outerRadius: 200,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 180,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                  ]}
                  height={500}
                />
              </div>

              <div className="barChartContainer1">
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
                  xAxis={[{ scaleType: 'band', dataKey: 'year' }]}
                  slotProps={{ legend: { hidden: true } }}
                  width={600}
                  height={350}
                />
              </div>

              <div className="barChartContainer2">
                <BarChart
                    dataset={dataset}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[
                      { dataKey: 'london', label: 'London', valueFormatter },
                      { dataKey: 'paris', label: 'Paris', valueFormatter },
                      { dataKey: 'newYork', label: 'New York', valueFormatter },
                      { dataKey: 'seoul', label: 'Seoul', valueFormatter },
                    ]}
                    {...chartSetting}
                  />
              </div>
            </div>
          </div> */}
      </div>     
    </div>   
  </>
  )
  
}

export default AccountsManagement;
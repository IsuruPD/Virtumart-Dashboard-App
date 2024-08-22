import React from 'react';
import './allOrders.scss';
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import "./../../components/dataTable/dataTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { auth, storage, firestore } from '../../firebase';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';



import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button'; 


const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");

  const fetchOrders = async () => {
    try {
      const usersSnapshot = await getDocs(collection(firestore, 'user'));
      let allOrders = [];
  
      for (const userDoc of usersSnapshot.docs) {
        const uid = userDoc.id;
        const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
        const userOrdersSnapshot = await getDocs(userOrdersRef);
  
        userOrdersSnapshot.forEach((userOrderDoc) => {
          const data = userOrderDoc.data();
          allOrders.push({
            orderId: userOrderDoc.id,
            ...data,
          });
        });
      }
  
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  function getColorFromInteger(colorInteger){
    console.log('#' + colorInteger.toString(16).padStart(6, '0'));
    const alpha = (colorInteger >> 24) & 0xFF;
    const red = (colorInteger >> 16) & 0xFF;
    const green = (colorInteger >> 8) & 0xFF;
    const blue = colorInteger & 0xFF;

  return `rgb(${red}, ${green}, ${blue})`;
  }
  
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>

            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>

          </TableCell>
          <TableCell component="th" scope="row">{row.orderId}</TableCell>
          <TableCell align="right">{row.orderDate}</TableCell>
          <TableCell align="left" style={{paddingLeft:100}}>
            
            {row.shippingAddress.receiverName},<br/> 
            {row.shippingAddress.addressAlias},&nbsp;{row.shippingAddress.address},&nbsp;
            {row.shippingAddress.city},&nbsp;{row.shippingAddress.district}<br/>
            {row.shippingAddress.contact}</TableCell>
          <TableCell style={{fontWeight:'bold'}}  align="right">{(row.orderTotal).toFixed(2)}</TableCell>
          <TableCell align="right">{row.orderStatus}</TableCell>

        </TableRow>
        <TableRow>

            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        
                        <Typography variant="h6" gutterBottom component="div">
                        Invoice
                        </Typography>

                        <Table size="small" aria-label="purchases">

                        <TableHead>
                            <TableRow>
                            <TableCell>Item ID</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell align="right">Specification</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Sub Total (Rs.)</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {row.orderItems.map((orderItem) => (
                            <TableRow key={orderItem.productId}>
                                <TableCell component="th" scope="row">
                                  {orderItem.product.productId}
                                </TableCell>
                                <TableCell>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div>
                                      <img src={orderItem.product.imageURLs[0]} alt="Item Image" className="itemImg" />
                                    </div>
                                    <div>{orderItem.product.productName}</div>
                                  </div>
                                </TableCell>
                                <TableCell align="right" style={{ verticalAlign: 'middle', alignItems: 'center' }}>
                                  <div style={{
                                      width: '20px',
                                      height: '20px',
                                      border: '1px solid black',
                                      borderRadius: '50%',
                                      backgroundColor: getColorFromInteger(orderItem.selectedColor),
                                      display: 'flex', // Adjust spacing between elements
                                    }}>
                                      <span style={{
                                        marginLeft: '125px'
                                      }}>{orderItem.selectedSize}</span>
                                      </div>
                                </TableCell>
                                <TableCell align="right">{orderItem.quantity}</TableCell>
                                <TableCell align="right">{(orderItem.quantity * orderItem.product.price * (1-orderItem.product.offerPercentage)).toFixed(2)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>

        </TableRow>
      </React.Fragment>
    );
  }
  
  Row.propTypes = {
    row: PropTypes.shape({
      
      orderId: PropTypes.number.isRequired,
      orderDate: PropTypes.string.isRequired,
      orderTotal: PropTypes.number.isRequired,
      orderStatus: PropTypes.string.isRequired,

      orderItems: PropTypes.arrayOf( 
        PropTypes.shape({
            product: PropTypes.shape({
                productId: PropTypes.string.isRequired,
                productName: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
                offerPercentage: PropTypes.number.isRequired,
                imageURLs: PropTypes.array.isRequired,
              }).isRequired,
            quantity: PropTypes.number.isRequired,
            selectedColor: PropTypes.number.isRequired,
            selectedSize: PropTypes.string.isRequired,
        }),
      ).isRequired,

      shippingAddress: PropTypes.arrayOf( 
        PropTypes.shape({
            receiverName: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
            shippingAlias: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            district: PropTypes.string.isRequired,
            contact: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };
/////////////////////


////////////////////

  const filteredOrders = orders.filter((order) => {
    
    const matchesSearchText =
      order.orderId.toString().includes(searchText) ||
      order.shippingAddress.receiverName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress.address.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress.contact.includes(searchText);

    const matchesDateRange =
      (!startDate || new Date(order.orderDate) >= new Date(startDate)) &&
      (!endDate || new Date(order.orderDate) <= new Date(endDate));

    const matchesTotalRange =
      (!minTotal || order.orderTotal >= parseFloat(minTotal)) &&
      (!maxTotal || order.orderTotal <= parseFloat(maxTotal));

    return matchesSearchText && matchesDateRange && matchesTotalRange;
  });

  const handleResetFilters = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setMinTotal("");
    setMaxTotal("");
    fetchOrders(); // Reset the filtered orders to the original orders
  };

  useEffect(() => {
    setOrders(orders);
  }, [orders]);
  

/////////////////////

  return (
    <div className="orderManagement">
      <SideBar />

      <div className="orderManagementContainer">
        <NavBar />
        <div className="orderManagementTitle">Order Management</div>

        <div className="orderManagementContent">
          
          <div className="orderManagementDatagrid">
            <div className="filterContainer">
              <TextField
                label="Search"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <TextField
                label="Min Total"
                type="number"
                value={minTotal}
                onChange={(e) => setMinTotal(e.target.value)}
              />
              <TextField
                label="Max Total"
                type="number"
                value={maxTotal}
                onChange={(e) => setMaxTotal(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={() => setOrders(filteredOrders)}>
                Apply
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
                Reset
              </Button>
            </div>

            <div className="datatable">
              <div className="datatableTitle">
                All Orders
              </div>
              <div className='middle'>
                      <div className='tableUserOrders'>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Order ID</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="left" style={{paddingLeft:100}}>Shipping Address</TableCell>
                                    <TableCell style={{fontWeight:'bold'}}  align="right">Total (Rs.)</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {orders.map((order) => (
                                    <Row key={order.orderId} row={order} />
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                      </div>
                    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;

import React from 'react';
import './allOrders.scss';
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import StatusUpdateDialog from '../../components/orderModificationDialog/OrderUpdateDialog';
import "./../../components/dataTable/dataTable.scss";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, orderBy, startAfter, limit, startAt } from 'firebase/firestore';
import { firestore } from '../../firebase';
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
import { CircularProgress, Backdrop } from "@mui/material";
import { useLocation } from 'react-router-dom';


const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [activeTab, setActiveTab] = useState("allOrders");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Code for pagination feature
  // const [lastVisible, setLastVisible] = useState(null);
  // const [firstVisible, setFirstVisible] = useState(null);
  // const [isFirstPage, setIsFirstPage] = useState(true);
  // const [isLastPage, setIsLastPage] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);

  //const ORDERS_PER_PAGE = 100;

  useEffect(() => {
    // Read the tab from query parameters
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true); // Start loading state

      const usersSnapshot = await getDocs(collection(firestore, 'user'));
      let allOrders = [];

      for (const userDoc of usersSnapshot.docs) {
        const uid = userDoc.id;
        const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
        let ordersQuery = userOrdersRef;

        // Filter orders based on the active tab
        if (activeTab === "pendingOrders") {
          ordersQuery = query(userOrdersRef, where("orderStatus", "==", "Ordered"));
        } else if (activeTab === "shippedOrders") {
          ordersQuery = query(userOrdersRef, where("orderStatus", "==", "Shipped"));
        } else if (activeTab === "completedOrders") {
          ordersQuery = query(userOrdersRef, where("orderStatus", "==", "Complete"));
        } else if (activeTab === "disputeOrders") {
          ordersQuery = query(userOrdersRef, where("orderStatus", "==", "In Dispute"));
        } else if (activeTab === "cancelledOrders") {
          ordersQuery = query(userOrdersRef, where("orderStatus", "==", "Cancelled"));
        }

        const userOrdersSnapshot = await getDocs(ordersQuery);
        userOrdersSnapshot.forEach((userOrderDoc) => {
          const data = userOrderDoc.data();
          allOrders.push({
            orderId: userOrderDoc.id,
            userId: uid,
            ...data,
          });
        });
      }

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }    
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const refreshOrders = () => {
    fetchOrders();
  };
  
  // For paging change the two function comments 
  // const fetchOrders = async (direction = 'next') => {
  //   try {
  //     const usersSnapshot = await getDocs(collection(firestore, 'user'));
  //     let allOrders = [];
  //     let querySnapshot;

  //     for (const userDoc of usersSnapshot.docs) {
  //       const uid = userDoc.id;
  //       const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');

  //       let ordersQuery;

  //       if (direction === 'next') {
  //         ordersQuery = lastVisible 
  //           ? query(userOrdersRef, orderBy('orderDate', 'desc'), startAfter(lastVisible), limit(ORDERS_PER_PAGE))
  //           : query(userOrdersRef, orderBy('orderDate', 'desc'), limit(ORDERS_PER_PAGE));
  //       } else if (direction === 'prev') {
  //         ordersQuery = query(userOrdersRef, orderBy('orderDate', 'desc'), startAt(firstVisible), limit(ORDERS_PER_PAGE));
  //       }

  //       querySnapshot = await getDocs(ordersQuery);

  //       if (!querySnapshot.empty) {
  //         querySnapshot.forEach((userOrderDoc) => {
  //           const data = userOrderDoc.data();
  //           allOrders.push({
  //             orderId: userOrderDoc.id,
  //             ...data,
  //           });
  //         });

  //         // Update pagination state
  //         if (direction === 'next') {
  //           setFirstVisible(querySnapshot.docs[0]);
  //           setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //         } else if (direction === 'prev') {
  //           setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //           setFirstVisible(querySnapshot.docs[0]);
  //         }

  //         // Update current page
  //         setCurrentPage((prevPage) => direction === 'next' ? prevPage + 1 : Math.max(prevPage - 1, 1));
  //         setIsFirstPage(direction === 'next' ? false : currentPage === 1);
  //         setIsLastPage(querySnapshot.docs.length < ORDERS_PER_PAGE);
  //       }
  //     }

  //     setOrders(allOrders);
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //   }
  // };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderTabContent = () => {

    return(
      <div>
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
              <Button variant="contained" color="primary" className='applyFiltersButton' onClick={() => setOrders(filteredOrders)}>
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
                              <TableCell align="center">Action</TableCell>
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

              <div className="paginationControls">
                <Button
                  variant="contained"
                  color="primary"
                  className='navButtons'
                  // onClick={() => fetchOrders('prev')}
                  // disabled={isFirstPage}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className='navButtons'
                  // onClick={() => fetchOrders('next')}
                  // disabled={isLastPage}
                >
                  Next
                </Button>
                {/* <Typography variant="body1">Page: {currentPage}</Typography> */}
              </div>
            </div>
      </div>
    );    
  };

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
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
      setDialogOpen(true);
    };
  
    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleOrderUpdate = (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        )
      );
    };
    

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
            {/* {row.shippingAddress.addressAlias},&nbsp; */}
            {row.shippingAddress.address},&nbsp;
            {row.shippingAddress.city},&nbsp;{row.shippingAddress.district}<br/>
            {row.shippingAddress.contact}</TableCell>
          <TableCell style={{fontWeight:'bold'}}  align="right">{(row.orderTotal).toFixed(2)}</TableCell>
          <TableCell align="right">{row.orderStatus}</TableCell>
          <TableCell align="center">
            <div>
              <button className="actionButton" onClick={handleDialogOpen}>Update</button>
            </div>
          </TableCell>
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

        {/* Status Update Dialog */}
      <StatusUpdateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        order={row}
        onOrderUpdate={handleOrderUpdate}
      />

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
      order.shippingAddress.addressAlias.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress.address.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress.district.toLowerCase().includes(searchText.toLowerCase()) ||
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

            <div className="tabContainer">
              <button className={`tablink ${activeTab === "allOrders" ? "active" : ""}`} onClick={() => setActiveTab("allOrders")}>All Orders</button>
              <button className={`tablink ${activeTab === "pendingOrders" ? "active" : ""}`} onClick={() => setActiveTab("pendingOrders")}>Pending Orders</button>
              <button className={`tablink ${activeTab === "shippedOrders" ? "active" : ""}`} onClick={() => setActiveTab("shippedOrders")}>Shipped Orders</button>
              <button className={`tablink ${activeTab === "completedOrders" ? "active" : ""}`} onClick={() => setActiveTab("completedOrders")}>Completed Orders</button>
              <button className={`tablink ${activeTab === "disputeOrders" ? "active" : ""}`} onClick={() => setActiveTab("disputeOrders")}>In Dispute</button>
              <button className={`tablink ${activeTab === "cancelledOrders" ? "active" : ""}`} onClick={() => setActiveTab("cancelledOrders")}>Cancelled</button>
            </div>

            <div className="tabContent">
              {renderTabContent()}
            </div>           
          </div>
        </div>
        {/* Loading State */}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
};

export default AllOrders;

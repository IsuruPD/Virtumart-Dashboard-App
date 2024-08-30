import React from 'react';
import './orderManagement.scss';
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import "./../../components/dataTable/dataTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Link } from 'react-router-dom';
import { CircularProgress, Backdrop } from "@mui/material";


const OrderManagement = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderedCount, setOrderedCount] = useState(0);
  const [cancelledCount, setCancellationsCount] = useState(0);
  const [disputeCount, setDisputesCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Start loading state

        // Fetch all UIDs from the 'user' collection
        const usersSnapshot = await getDocs(collection(firestore, 'user'));
        let allOrders = [];
        
        // Get counts to display in the cards
        let countOrdered = 0; 
        let cancelledCount = 0;
        let disputeCount = 0; 
  
        for (const userDoc of usersSnapshot.docs) {
          const uid = userDoc.id; // Get the UID from the document ID
  
          // Fetch 'user_orders' subcollection using the UID
          const userOrdersRef = collection(firestore, 'orders', uid, 'user_orders');
          const userOrdersSnapshot = await getDocs(userOrdersRef);
  
          if (!userOrdersSnapshot.empty) {
            userOrdersSnapshot.forEach((userOrderDoc) => {
              const data = userOrderDoc.data();
  
              const itemCount = data.orderItems ? data.orderItems.length : 0;
  
              // Extract the city and contact from the shipping address
              const city = data.shippingAddress?.city || '';
              const receiverName = data.shippingAddress?.receiverName || '';
              const contact = data.shippingAddress?.contact || '';

              const orderTotal = data.orderTotal ? data.orderTotal.toFixed(2) : '0.00';
  
              // Add the formatted data to the array
              allOrders.push({
                id: userOrderDoc.id,
                ...data,
                itemCount,
                receiverName,
                city,
                contact,
                orderTotal,
              });
            
              // Check the order status to get pending counts
              if (data.orderStatus === "Ordered") {
                countOrdered++;
              } else if (data.orderStatus === "Cancelled") {
                cancelledCount++;
              } else if (data.orderStatus === "In Dispute") {
                disputeCount++;
              } else {

              }
            
            });
          }
        }
        // Set pending counts
        setOrderedCount(countOrdered);
        setCancellationsCount(cancelledCount);
        setDisputesCount(disputeCount);

        // Sort the orders by the most recent date
        allOrders = allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  
        setOrders(allOrders);
        console.log("Final order data:", allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: 'orderId', headerName: 'Order ID', width: 150},
    { field: 'orderDate', headerName: 'Date', width: 120 },
    { field: 'city', headerName: 'Shipping', width: 120 },
    { field: 'itemCount', headerName: 'Item Count', width: 100 },
    { field: 'receiverName', headerName: 'Customer Name', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'orderTotal', headerName: 'Total (Rs.)', width: 150 },
  ];

  const handleView = (order) => {
    console.log(order);
  };

  return (
    <div className="orderManagement">
      <SideBar />

      <div className="orderManagementContainer">
        <NavBar />

        <div className="orderManagementTitle">Order Management</div>

        <div className="orderManagementContent">
          <div className="orderManagementDatagrid">
            
            <div className="datatable">
              <div className="datatableTitle">
                Recent Orders
                <Link to="/orders/all" className="link">
                  View All Orders
                </Link>
              </div>
              <DataGrid
                className="datagrid"
                rows={orders}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          </div>

          <div className="orderManagementCards">
            <Link to="/orders/all?tab=pendingOrders">
              <div className="card">
                <p className='cardTitle'>Pending Orders</p>
                <p className='totalCount'>{orderedCount}</p>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>             
              </div>
            </Link>
            
            <Link to="/orders/all?tab=cancelledOrders">
              <div className="card">
                <p className='cardTitle'>Cancellations</p>
                <p className='totalCount'>{cancelledCount}</p>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
              </div>
            </Link>

            <Link to="/orders/all?tab=disputeOrders">
              <div className="card">
                <p className='cardTitle'>Order Disputes</p>
                <p className='totalCount'>{disputeCount}</p>
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Loading State */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default OrderManagement;

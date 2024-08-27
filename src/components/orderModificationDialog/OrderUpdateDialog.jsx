import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { CircularProgress, Backdrop } from "@mui/material";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { doc, updateDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { firestore } from '../../firebase';
import EditIcon from '@mui/icons-material/Edit';


const OrderUpdateDialog = ({ open, onClose, order, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
  const [orderId] = useState(order.orderId);
  const [orderDate] = useState(order.orderDate);
  const [orderTotal] = useState(order.orderTotal);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Destructure shippingAddress from the order object
  const { shippingAddress } = order;
  const { address, addressAlias, city, contact, district, receiverName} = shippingAddress || {};

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode); 
  };

  const handleUpdate = async () => {
    try {
      setLoading(true); // Start loading state

      const { orderId, userId } = order;
      console.log(`Updating document at path: orders/${userId}/user_orders/${orderId}`);

      if (orderId && userId) {
        const userOrdersRef = collection(firestore, `orders/${userId}/user_orders`);
        
        // Query to find the document where orderId matches
        const q = query(userOrdersRef, where("orderId", "==", orderId));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref; 
            console.log(`Updating document at path: ${docRef.path}`);
  
          // Update the order status in Firestore
          await updateDoc(docRef, { orderStatus: selectedStatus });

          // Update the local state to reflect the change
          onStatusUpdate(orderId, selectedStatus);
  
          // Close the dialog
          onClose();
        } else {
          alert("No document found with the given orderId.");
        }
      } else {
        alert("Order ID or User ID is missing.");
      }
    } catch (error) {
      console.log("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'rgb(120, 28, 206)', color: '#ffffff', paddingLeft: '24px', paddingBottom: '35px', paddingTop: '20px', fontSize: '25px', fontWeight: 'bold' }}>
        Update Order Status
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="topHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5>OrderID: {orderId}</h5> 
            <h5>Date: {orderDate}</h5>
          </div>
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #ddd' }} />
          
          <div className="middleContent" style={{ display: 'flex', gap: '40px' }}>
            
            <div className="middleLeft" style={{ flex: '2' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4>Customer Details</h4>
                <IconButton onClick={handleEditToggle}>
                  <EditIcon />
                </IconButton>     
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isEditMode ? (
                  <>
                    <TextField
                      margin="dense" name="customerName" label="Customer Name" type="text" fullWidth
                      value={receiverName || ''} onChange={handleStatusChange} />
                    <TextField
                      margin="dense" name="customerAddress" label="Address" type="text" fullWidth
                      value={address || ''} onChange={handleStatusChange} />
                      <TextField
                      margin="dense" name="customerCity" label="City" type="text" fullWidth
                      value={city || ''} onChange={handleStatusChange} />
                      <TextField
                      margin="dense" name="customerDistrict" label="District" type="text" fullWidth
                      value={district || ''} onChange={handleStatusChange} />
                      <TextField
                      margin="dense" name="customerContact" label="Contact Number" type="text" fullWidth
                      value={contact || ''} onChange={handleStatusChange} />
                  </>
                ) : (
                  <>
                    <Typography variant="body1">Customer Name: {receiverName || 'N/A'}</Typography>
                    <Typography variant="body1">Customer Address: {address || 'N/A'}</Typography>
                  </>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4>Purchase List</h4>
                <ol style={{ paddingLeft: '20px', marginTop: '10px' }}>
                  <li>Product 01</li>
                  <li>Product 02</li>
                  <li>Product 03</li>
                  <li>Product 04</li>
                  <li>Product 05</li>
                  <li>Product 06</li>
                </ol>
              </div>
            </div>

            <div className="middleRight" style={{ flex: '1', paddingTop: '16px' }}>
              <h4>Order Status</h4>
              <RadioGroup value={selectedStatus} onChange={handleStatusChange}>
                <FormControlLabel value="Ordered" control={<Radio />} label="Pending" />
                <FormControlLabel value="Shipped" control={<Radio />} label="Shipped" />
                <FormControlLabel value="Complete" control={<Radio />} label="Complete" />
                <FormControlLabel value="Cancelled" control={<Radio />} label="Cancelled" />
                <FormControlLabel value="In Dispute" control={<Radio />} label="In Dispute" />
              </RadioGroup>
            </div>
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />
          <div className="bottomFooter" style={{ textAlign: 'right' }}>
            <h4>Total : Rs.{orderTotal}</h4>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="actionBar" sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
        <Button onClick={handleUpdate} color="primary" variant="contained">Update</Button>
      </DialogActions>

      {/* Loading State */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default OrderUpdateDialog;

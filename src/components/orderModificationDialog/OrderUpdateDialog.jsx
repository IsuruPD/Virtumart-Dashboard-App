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


const OrderUpdateDialog = ({ open, onClose, order, onOrderUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
  const [orderId] = useState(order.orderId);
  const [orderDate] = useState(order.orderDate);
  const [orderTotal] = useState(order.orderTotal);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Destructure shippingAddress from the order object
  const { shippingAddress } = order;
  // const { address, addressAlias, city, contact, district, receiverName} = shippingAddress || {};
  const [receiverName, setReceiverName] = useState(shippingAddress?.receiverName || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [district, setDistrict] = useState(shippingAddress?.district || '');
  const [contact, setContact] = useState(shippingAddress?.contact || '');

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
          await updateDoc(docRef, {
            orderStatus: selectedStatus,
            "shippingAddress.receiverName": receiverName,
            "shippingAddress.address": address,
            "shippingAddress.city": city,
            "shippingAddress.district": district,
            "shippingAddress.contact": contact
          });

          // Update the local state to reflect the change
          const updatedOrder = {
            ...order,
            orderStatus: selectedStatus,
            shippingAddress: {
              receiverName,
              address,
              city,
              district,
              contact
            }
          };
          onOrderUpdate(updatedOrder);
  
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: '12px', bgcolor: 'rgb(120, 28, 206)', color: '#ffffff', paddingLeft: '24px', paddingBottom: '30px', paddingTop: '20px', fontSize: '25px', fontWeight: 'bold' }}>
        <>Update Order Status </>
        <h5>(OrderID: {orderId})</h5> 
      </DialogTitle>
      <DialogContent sx={{ padding: '24px', marginTop: '5px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="topHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div></div>
            <h5>Date: {orderDate}</h5>
          </div>
          {/* <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #ddd' }} /> */}
          
          <div className="middleContent" style={{ display: 'flex', gap: '40px' }}>
            
            <div className="middleLeft" style={{ flex: '2' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <h3>Customer Details</h3>
                <IconButton onClick={handleEditToggle}>
                  <EditIcon />
                </IconButton>     
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isEditMode ? (
                  <>
                    <TextField
                      margin="dense" name="customerName" label="Customer Name" type="text" fullWidth
                      value={receiverName || ''} onChange={(e) => setReceiverName(e.target.value)} />
                    <TextField
                      margin="dense" name="customerAddress" label="Address" type="text" fullWidth
                      value={address || ''} onChange={(e) => setAddress(e.target.value)} />
                      <TextField
                      margin="dense" name="customerCity" label="City" type="text" fullWidth
                      value={city || ''} onChange={(e) => setCity(e.target.value)} />
                      <TextField
                      margin="dense" name="customerDistrict" label="District" type="text" fullWidth
                      value={district || ''} onChange={(e) => setDistrict(e.target.value)} />
                      <TextField
                      margin="dense" name="customerContact" label="Contact Number" type="text" fullWidth
                      value={contact || ''} onChange={(e) => setContact(e.target.value)} />
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <div className="record" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                      <label style={{ fontWeight: 'bold' }}>Customer Name:</label>
                      <Typography variant="body1">{receiverName || 'N/A'}</Typography>
                    </div>
                    <div className="record" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                      <label style={{ fontWeight: 'bold' }}>Customer Address:</label>
                      <Typography variant="body1">
                        {address || ''}, {city || ''}, {district || ''} <br /> {contact || ''}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3>Purchase List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Product ID</th>
                      {/* <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Product Name</th> */}
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Price(Rs.)</th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Discount</th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Quantity</th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total(Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{item.product.productId}</td>
                        {/* <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{item.product.productName.substring(0, 10)}{item.product.productName.length > 10 ? '...' : ''}</td> */}
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                          {item.product.price.toFixed(2)}
                        </td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right'  }}>
                          {item.product.offerPercentage.toFixed(3)*100}%
                        </td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right'  }}>{item.quantity}</td>
                        <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'right'  }}>
                          {(item.product.price.toFixed(2)*(1-item.product.offerPercentage.toFixed(3))*(item.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{borderLeft: '1px solid #ddd'}}></div>
            <div className="middleRight" style={{ flex: '1', paddingTop: '16px' }}>
              <h3>Order Status</h3>
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
            <h3>Total : Rs.{orderTotal}</h3>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="actionBar" sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
        <Button onClick={handleUpdate} color="primary" variant="contained">{loading ? 'Updating...' : 'Update'}</Button>
      </DialogActions>

      {/* Loading State */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

export default OrderUpdateDialog;

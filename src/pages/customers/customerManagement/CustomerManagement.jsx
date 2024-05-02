import React, { useState, useEffect } from 'react';
import './customerManagement.scss';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { auth, storage, firestore } from '../../../firebase';
import SideBar from '../../../components/sideBar/SideBar';
import NavBar from '../../../components/navBar/NavBar';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
/////
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
/////

////////////////////
const CustomerManagement = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // If existing
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDocRef = doc(firestore, 'user', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // If user exists, set the data
          setUser({ id: userDocSnap.id, ...userDocSnap.data() });

          // Fetch orders for the user
          const ordersQuery = query(
            collection(firestore, 'orders', userId, 'user_orders')
          );
          const ordersSnapshot = await getDocs(ordersQuery);

          const fetchedOrders = [];
          ordersSnapshot.forEach((doc) => {
            fetchedOrders.push({ orderId: doc.id, ...doc.data() });
          });

          setOrders(fetchedOrders);
        } else {
          console.error(`User with ID ${userId} not found`);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser(); // Fetch user data and orders on component mount
  }, [userId]);
////////////////////


/////////////////////

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
          <TableCell style={{fontWeight:'bold'}}  align="right">{row.orderTotal}</TableCell>
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
                                <TableCell><img src={orderItem.product.imageURLs[0]}  alt="Item Image" className="itemImg" />
                                    {orderItem.product.productName}</TableCell>
                                <TableCell align="right" style={{ verticalAlign: 'middle', alignItems: 'center' }}>
      
      <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: getColorFromInteger(orderItem.selectedColor),
          display: 'flex', // Adjust spacing between elements
        }}>
          <span style={{
            marginLeft: '350px'
          }}>{orderItem.selectedSize}</span>
          </div>
    </TableCell>
                                <TableCell align="right">{orderItem.quantity}</TableCell>
                                <TableCell align="right">{Math.round(orderItem.quantity * orderItem.product.price * (1-orderItem.product.offerPercentage))}</TableCell>
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


  return (
    <div className="customerManagement">
      <SideBar />
      <div className="customerManagementContainer">
        <NavBar />
        <div className="customerManagementTitle">User Profile</div>
        <div className="userProfile">
            {user && ( 
                
                <div className="singleItemContainer">
                    <div className="selectedUserTitle">
                        <h1>User Management</h1>
                    </div>

                    <div className="top">
                        <div className="left">                
                            <div className="editButtonContainer">
                                {/* <Link className="link">
                                <div className="editButton">
                                    Edit
                                    </div>
                                </Link> */}
                            </div>
                            <div className="cardHeader">
                                <div className="cardIcon">
                                <PersonIcon/>
                                </div>
                                <h1 className="title">User Card</h1>
                            </div>

                            <div className="item">
                                <img
                                src={user.imagePath}
                                alt="Profile Image"
                                className="itemImg"
                                />
                                <div className="details">
                                <h1 className="itemTitle">{user.firstname}&nbsp;{user.lastname} <span className='id' style={{fontSize:16}}>&nbsp;({user.id}) </span></h1>
                                <table>
                                    <tbody>
                                    <tr>
                                    <td><div className="detailItem">
                                            <span className="itemKey">Email:</span>
                                            <span className="itemValue">{user.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="detailItem">
                                            <span className="itemKey">NIC:</span>
                                            <span className="itemValue">{user.nic}</span>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="detailItem">
                                        <span className="itemKey">Phone:</span>
                                        <span className="itemValue">{user.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="detailItem">
                                        <span className="itemKey">DOB:</span>
                                        <span className="itemValue">{user.dob}</span>
                                    </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="detailItem">
                                            <span className="itemKey">Address:</span>
                                            <span className="itemValue">{user.address}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="detailItem">
                                            <span className="itemKey">Gender:</span>
                                            <span className="itemValue">{user.gender}</span>
                                        </div>
                                    </td>
                                    </tr>
                                    {/* <tr>
                                    <td>
                                        <div className="detailItem">
                                        <span className="itemKey">Role:</span>
                                        <span className="itemValue">Role</span>
                                        </div>
                                    </td>
                                    <td>
                                        
                                    </td>
                                    </tr> */}
                                    </tbody>
                                </table>  
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='middle'>
                      <div className='tableTitle'>
                        Past Orders
                      </div>
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

                    <div className='bottom'>
                    </div>
                </div>
                                   
            )}
            
            {!user && (                
                <div className="singleItemContainer">
                    <div className="selectedUserTitle">
                        <h1>Select User</h1>
                    </div>

                    <div className="top">
                        <div className="left">                
                            <div className="editButtonContainer">
                                
                            </div>
                            <div className="cardHeader">
                                <div className="cardIcon">
                                <PersonIcon/>
                                </div>
                                <h1 className="title">User Card</h1>
                            </div>

                            <div className="item">
                                <div className="details">
                                <h1 className="itemTitle">N/A</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;

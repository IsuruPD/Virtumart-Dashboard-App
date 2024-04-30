import React, { useState, useEffect } from 'react';
import './customerManagement.scss';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
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

  // If existing
  useEffect(() => {
    console.log(userId);
    const fetchUser = async () => {
      try {
        const userDocRef = doc(firestore, 'user', userId);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          // If employee exists, set the data
          setUser({ id: userDocSnap.id, ...userDocSnap.data() });
        } else {
          //console.error(`Employee with ID ${employeeId} not found`);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
  
    fetchUser(); // Fetch employee data on component mount
  }, [userId]); // Re-fetch employee data if employeeId changes
////////////////////


/////////////////////
  
  function createData(orderId, orderDate, orderTotal, orderStatus) {
    return {
      orderId,
      orderDate,
      orderTotal,
      orderStatus,
      orderItems: [
        {
          itemId: '0001SKU',
          itemName: 'Refridgerator',
          quantity: 3,
          itemPrice: 100,
        },
        {
          itemId: '0002SKU',
          itemName: 'Television',
          quantity: 1,
          itemPrice: 200,
        },
      ],
    };
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
          <TableCell component="th" scope="row">
            {row.orderId}
          </TableCell>
          <TableCell align="right">{row.orderDate}</TableCell>
          <TableCell align="right">{row.orderTotal}</TableCell>
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
                                  <TableCell align="right">Quantity</TableCell>
                                  <TableCell align="right">Total price ($)</TableCell>
                              </TableRow>
                          </TableHead>
                          
                          <TableBody>
                              {row.orderItems.map((orderItemsRow) => (
                                  <TableRow key={orderItemsRow.itemId}>
                                      <TableCell component="th" scope="row">
                                          {orderItemsRow.itemId}
                                      </TableCell>
                                      <TableCell>
                                          {orderItemsRow.itemName}
                                      </TableCell>
                                      <TableCell align="right">
                                          {orderItemsRow.quantity}
                                      </TableCell>
                                      <TableCell align="right">
                                          {Math.round(orderItemsRow.quantity * orderItemsRow.itemPrice * 100) / 100}
                                      </TableCell>
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
      
      orderId: PropTypes.string.isRequired,
      orderDate: PropTypes.number.isRequired,
      orderTotal: PropTypes.number.isRequired,
      orderStatus: PropTypes.number.isRequired,
      orderItems: PropTypes.arrayOf(
        PropTypes.shape({
          quantity: PropTypes.number.isRequired,
          itemName: PropTypes.string.isRequired,
          itemId: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };
  
  const rows = [
    createData('Order_ID001', '2024-01-01', 99999, 'Ordered'),
    createData('Order_ID002', '2024-01-01', 88999, 'Ordered'),
    createData('Order_ID003', '2024-01-01', 14999, 'Delivered'),
    createData('Order_ID004', '2024-01-01', 75999, 'Completed'),
    createData('Order_ID005', '2024-01-01', 199999, 'Cancelled'),
  ];
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
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Order ID</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Total ($)</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <Row key={row.orderId} row={row} />
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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

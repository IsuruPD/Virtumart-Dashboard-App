import React from 'react';
import "./customerDetails.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import { Link } from 'react-router-dom';
import "./../../components/dataTable/dataTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
//////////

const CustomerDetails = () => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
      const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'user'));
      const userData = [];
      querySnapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  // Define columns for DataGrid
  const columns = [
    {
      field: "imagePath",
      headerName: "",
      width: 75,
      renderCell: (params) => {
        return (
          <div className="cellWithImg" style={{justifyContent: 'center'}}>
            <img className="cellImg" src={params.row.imagePath} alt="avatar" />
          </div>
        );
      },
    },
    {
      field: "firstname",
      headerName: "Full Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row.firstname} {params.row.lastname}
          </div>
        );
      },
    },
    { field: 'nic', headerName: 'NIC', width: 100 },
    { field: 'gender', headerName: 'Gender'},
    { field: 'email', headerName: 'Email', width: 150},
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'address', headerName: 'Address', width: 200},
  ];
  
  const handleView = (user) => {
    setSelectedUser(user);
    // {console.log(user)}
    window.location.href = `/users/manage/${user.id}`;
  };

  const handleEditClick = (selectedUser) => {
    // Redirect to StaffManagement page with userId parameter
    console.log(selectedUser.id);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDisable = (id) => {
    // 
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            
              <div 
                className="viewButton"
                onClick={()=>handleView(params.row)}
                >
                  View
                </div>
      
              <div
                className="disableButton"
                onClick={() => handleDisable(params.row.id)}
              >
                Disable
              </div>
          </div>
        ); 
      },
    },
  ];

  return (
    <div className="customerDetails">
      <SideBar />

      <div className="customerDetailsContainer">
        <NavBar />
          <div className="customerDetailsTitle">
            Customer Management
          </div>
          <div className="datatable">
            <div className="datatableTitle">
              User Records
            </div>
            <DataGrid
              className="datagrid"
              rows={users}
              columns={columns.concat(actionColumn)}
              pageSize={4}
              // rowsPerPageOptions={[4]}
              // checkboxSelection
            />
          </div>
      </div>
    </div>
  )
}

export default CustomerDetails;

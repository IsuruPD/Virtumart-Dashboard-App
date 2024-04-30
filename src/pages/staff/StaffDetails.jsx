import React from 'react';
import "./staffDetails.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import BadgeIcon from '@mui/icons-material/Badge';
import { Link } from 'react-router-dom';
import "./../../components/dataTable/dataTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

///////
const StaffDetails = () => {

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'employees'));
      const employeeData = [];
      querySnapshot.forEach((doc) => {
        employeeData.push({ id: doc.id, ...doc.data() });
      });
      setEmployees(employeeData);
    };

    fetchEmployees();
  }, []);

  // Define columns for DataGrid
  const columns = [
    {
      field: "fullName",
      headerName: "Employee",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.profileImageURL} alt="avatar" />
            {params.row.fullName}
          </div>
        );
      },
    },
    { field: 'employeeId', headerName: 'Employee ID'},
    { field: 'nic', headerName: 'NIC'},
    { field: 'gender', headerName: 'Gender'},
    { field: 'dob', headerName: 'DOB'},
    { field: 'email', headerName: 'Email' },
    { field: 'phoneNumber', headerName: 'Phone Number'},
    { field: 'address', headerName: 'Address' },
    { field: 'username', headerName: 'Username'},
    { field: 'role', headerName: 'Role'},
  ];
  
  //Fetch table columns dynamically
  /* 
  
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

const StaffDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'employees'));
      const employeeData = [];
      querySnapshot.forEach((doc) => {
        employeeData.push({ id: doc.id, ...doc.data() });
      });

      // Set employees state with updated data including row number
      setEmployees(employeeData);

      // Define columns dynamically
      const firstEmployee = employeeData[0];
      if (firstEmployee) {
        const employeeKeys = Object.keys(firstEmployee);
        const formattedColumns = [
          { field: 'id', headerName: 'ID', width: 0 },
          ...employeeKeys
            .filter((key) => key !== 'id') // Exclude 'id' from columns
            .map((key) => ({
              field: key,
              headerName: key.charAt(0).toUpperCase() + key.slice(1),
              width: 150,
            })),
        ];

        setColumns(formattedColumns);
      }
    };

    fetchEmployees();
  }, []);


  */

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleEditClick = (selectedEmployee) => {
    // Redirect to StaffManagement page with employeeId parameter
    console.log(selectedEmployee.id);
    window.location.href = `/staff/manage/edit/${selectedEmployee.id}`;
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
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
    <div className="staffDetails">
      <SideBar />

      <div className="staffDetailsContainer">
        <NavBar />
        <div className="staffDetailsTitle">
          Staff Management
        </div>

          <div className='singleStaff'>
          {selectedEmployee && (
            <div className="singleItemContainer">
                <div className="top">
                <div className="left">
                
                <div className="editButtonContainer" onClick={() => handleEditClick(selectedEmployee)}>
                  {console.log(selectedEmployee.id)}
                    <Link className="link">
                      <div className="editButton">
                        Edit
                        </div>
                    </Link>
                </div>
                  <div className="cardHeader">
                    <div className="cardIcon">
                      <BadgeIcon/>
                    </div>
                    <h1 className="title">Employee Card</h1>
                  </div>

                  <div className="item">
                    <img
                      src={selectedEmployee.profileImageURL}
                      alt="Profile Image"
                      className="itemImg"
                    />
                    <div className="details">
                      <h1 className="itemTitle">{selectedEmployee.fullName} <span className='id'>&nbsp;({selectedEmployee.employeeId}) </span></h1>
                      <table>
                        <tbody>
                        <tr>
                          <td><div className="detailItem">
                                <span className="itemKey">Email:</span>
                                <span className="itemValue">{selectedEmployee.email}</span>
                              </div>
                          </td>
                          <td>
                              <div className="detailItem">
                                <span className="itemKey">NIC:</span>
                                <span className="itemValue">{selectedEmployee.nic}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="detailItem">
                              <span className="itemKey">Phone:</span>
                              <span className="itemValue">{selectedEmployee.phoneNumber}</span>
                            </div>
                          </td>
                          <td>
                            <div className="detailItem">
                              <span className="itemKey">DOB:</span>
                              <span className="itemValue">
                                {selectedEmployee.dob}
                              </span>
                          </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="detailItem">
                                <span className="itemKey">Address:</span>
                                <span className="itemValue">
                                  {selectedEmployee.address}
                                </span>
                            </div>
                          </td>
                          <td>
                            <div className="detailItem">
                                <span className="itemKey">Gender:</span>
                                <span className="itemValue">
                                  {selectedEmployee.gender}
                                </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="detailItem">
                              <span className="itemKey">Role:</span>
                              <span className="itemValue">{selectedEmployee.role}</span>
                            </div>
                          </td>
                          <td>
                            
                          </td>
                        </tr>
                        </tbody>
                      </table>  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}</div>


          <div className="datatable">
            <div className="datatableTitle">
              Staff Records
              <Link to="/staff/manage/new/create" className="link">
                Add New
              </Link>
            </div>
            <DataGrid
              className="datagrid"
              rows={employees}
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
export default StaffDetails;
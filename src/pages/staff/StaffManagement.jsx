import React from 'react';
import "./staffManagement.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import { Link } from 'react-router-dom';

const StaffManagement = () => {

  return (
    <div className="staffManagement">
      <SideBar />

      <div className="staffManagementContainer">
        <NavBar />
        <div className="staffManagementTitle">
          Staff Management
          <Link to="/staff/new" className="link">
            Add New
          </Link>
        </div>

        <Datatable />
      </div>
    </div>
  )
}

export default StaffManagement;

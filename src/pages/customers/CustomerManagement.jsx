import React from 'react';
import "./customerManagement.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import { Link } from 'react-router-dom';

const CustomerManagement = () => {

  return (
    <div className="customerManagement">
      <SideBar />

      <div className="customerManagementContainer">
        <NavBar />
        <div className="customerManagementTitle">
          Customer Management
          {/* <Link to="/products/new" className="link">
            Add New
          </Link> */}
        </div>

        <Datatable />
      </div>
    </div>
  )
}

export default CustomerManagement;

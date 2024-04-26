import React from 'react';
import "./orderManagement.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import { Link } from 'react-router-dom';

const OrderManagement = () => {

  return (
    <div className="orderManagement">
      <SideBar />

      <div className="orderManagementContainer">
        <NavBar />
        <div className="orderManagementTitle">
          Orders Management
          {/* <Link to="/products/new" className="link">
            Add New
          </Link> */}
        </div>

        <Datatable />
      </div>
    </div>
  )
}

export default OrderManagement;

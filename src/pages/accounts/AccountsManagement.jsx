import React from 'react';
import "./accountsManagement.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import { Link } from 'react-router-dom';

const AccountsManagement = () => {

  return (
    <div className="accountsManagement">
      <SideBar />

      <div className="accountsManagementContainer">
        <NavBar />
        <div className="accountsManagementTitle">
          Accounts Management
          {/* <Link to="/products/new" className="link">
            Add New
          </Link> */}
        </div>

        <Datatable />
      </div>
    </div>
  )
}

export default AccountsManagement;

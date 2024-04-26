import React from 'react';
import "./customerSupport.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import { Link } from 'react-router-dom';

const CustomerSupport = () => {

  return (
    <div className="customerSupport">
      <SideBar />

      <div className="customerSupportContainer">
        <NavBar />
        <div className="customerSupportTitle">
          Customer Support
          {/* <Link to="/products/new" className="link">
            Add New
          </Link> */}
        </div>

        <Datatable />
      </div>
    </div>
  )
}

export default CustomerSupport;

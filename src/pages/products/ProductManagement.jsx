import React from 'react';
import "./productManagement.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import Datatable from '../../components/dataTable/DataTable';
import { Link } from 'react-router-dom';

const ProductManagement = () => {

  return (
    <div className="productManagement">
      <SideBar />

      <div className="productManagementContainer">
        <NavBar />
        <div className="productManagementTitle">
          Products Management
          <Link to="/products/new" className="link">
            Add New
          </Link>
        </div>

        <Datatable />
      </div>
    </div>
  )
}

export default ProductManagement;

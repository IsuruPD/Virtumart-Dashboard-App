import React from 'react';
import "./customerSupport.scss";
import SideBar from '../../components/sideBar/SideBar';
import NavBar from '../../components/navBar/NavBar';
import { Link } from 'react-router-dom';

const CustomerSupport = () => {
  return (
    <div className="customerSupport">
      <SideBar />
      <div className="customerSupportContainer">
        <div className="customerSupportTitle">
          Welcome to Customer Support
        </div>
        <Link to="http://localhost:5173/" target="_blank" rel="noopener noreferrer" className="navButton">
          Go to Customer Care Portal
        </Link>
        
      </div>
    </div>
  );
};

export default CustomerSupport;

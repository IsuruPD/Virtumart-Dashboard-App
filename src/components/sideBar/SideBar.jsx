import React from 'react';
import "./sideBar.scss";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentsIcon from '@mui/icons-material/Payments';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Link } from 'react-router-dom';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const SideBar = () => {
  return (
    <div class="sideBar">
        <div className="top">
            <Link to="/" style={{textDecoration: "none" }}>
                <span className="logo">VirtuMart</span>
            </Link>
        </div>
        <hr/>
        <div className="center">
            <ul>

                
                <p className="title">Main</p>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li> <DashboardIcon className="sideBarIcon"/> <span>Dashboard</span></li>
                </Link>


                <p className="title">Manage</p>
                <Link to="/users" style={{textDecoration: "none" }}>
                    <li> <PeopleAltIcon className="sideBarIcon"/> <span> Users</span></li>
                </Link>
                <Link to="/staff" style={{textDecoration: "none" }}>
                    <li> <BadgeIcon className="sideBarIcon"/> <span> Staff</span></li>
                </Link>
                <Link to="/products" style={{textDecoration: "none" }}>
                    <li> <InventoryIcon className="sideBarIcon"/> <span>Products</span></li>
                </Link>
                <Link to="/orders" style={{textDecoration: "none" }}>
                    <li> <StoreIcon className="sideBarIcon"/> <span>Orders</span></li>
                </Link>
                <Link to="/support" style={{textDecoration: "none" }}>
                    <li> <SupportAgentIcon className="sideBarIcon"/> <span>Customer Support</span></li>
                </Link>
                <Link to="/accounts" style={{textDecoration: "none" }}>
                    <li> <PaymentsIcon className="sideBarIcon"/> <span>Accounts</span></li>
                </Link>


                <p className="title">System</p>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li> <NotificationsIcon className="sideBarIcon"/> <span>Notifications</span></li>
                </Link>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li> <SettingsIcon className="sideBarIcon"/> <span>Settings</span></li>
                </Link>


                <p className="title">User</p>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li> <PersonIcon className="sideBarIcon"/> <span>Profile</span></li>
                </Link>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li> <LogoutIcon className="sideBarIcon"/> <span>Logout</span></li>
                </Link>
            </ul>
        </div>
        {/* <div className="bottom">
            <div className="colorOptions"></div>
            <div className="colorOptions"></div>
        </div> */}
    
    </div>
  )
}

export default SideBar
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
import LogoImage from '../../assets/logoBg.png';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const SideBar = () => {
  return (
    <div class="sideBar">
        <div className="top">
            {/* <img src={LogoImage} alt="Logo" className="logoImage" /> */}
            <Link to="/" style={{textDecoration: "none" }}>
                <span className="logo">VirtuMart</span>
            </Link>
        </div>
        <hr/>
        <div className="center">
            <ul>


                <p className="title">Main</p>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li className="dashboardItem"> <DashboardIcon className="sideBarIcon"/> <span>Dashboard</span></li>
                </Link>


                <p className="title">Manage</p>
                <Link to="/users" style={{textDecoration: "none" }}>
                    <li className="usersItem"> <PeopleAltIcon className="sideBarIcon"/> <span> Users</span></li>
                </Link>
                <Link to="/staff" style={{textDecoration: "none" }}>
                    <li className="staffItem"> <BadgeIcon className="sideBarIcon"/> <span> Staff</span></li>
                </Link>
                <Link to="/products" style={{textDecoration: "none" }}>
                    <li className="productsItem"> <InventoryIcon className="sideBarIcon"/> <span>Products</span></li>
                </Link>
                <Link to="/orders" style={{textDecoration: "none" }}>
                    <li className="ordersItem"> <StoreIcon className="sideBarIcon"/> <span>Orders</span></li>
                </Link>
                <Link to="/support" style={{textDecoration: "none" }}>
                    <li className="supportItem"> <SupportAgentIcon className="sideBarIcon"/> <span>Customer Support</span></li>
                </Link>
                <Link to="/accounts" style={{textDecoration: "none" }}>
                    <li className="accountsItem"> <PaymentsIcon className="sideBarIcon"/> <span>Accounts</span></li>
                </Link>


                <p className="title">System</p>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li className="notificationsItem"> <NotificationsIcon className="sideBarIcon"/> <span>Notifications</span></li>
                </Link>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li className="settingsItem"> <SettingsIcon className="sideBarIcon"/> <span>Settings</span></li>
                </Link>


                <p className="title">User</p>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li className="profileItem"> <PersonIcon className="sideBarIcon"/> <span>Profile</span></li>
                </Link>
                <Link to="/" style={{textDecoration: "none" }}>
                    <li className="logoutItem"> <LogoutIcon className="sideBarIcon"/> <span>Logout</span></li>
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
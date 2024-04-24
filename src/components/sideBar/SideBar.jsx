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
import LogoutIcon from '@mui/icons-material/Logout';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const SideBar = () => {
  return (
    <div class="sideBar">
        <div className="top">
            <span className="logo">VirtuMart</span>
        </div>
        <hr/>
        <div className="center">
            <ul>
                <p className="title">Main</p>
                <li> <DashboardIcon className="sideBarIcon"/> <span>Dashboard</span></li>

                <p className="title">Manage</p>
                <li> <PeopleAltIcon className="sideBarIcon"/> <span> Users</span></li>
                <li> <InventoryIcon className="sideBarIcon"/> <span>Products</span></li>
                <li> <PaymentsIcon className="sideBarIcon"/> <span>Orders</span></li>
                <li> <LocalShippingIcon className="sideBarIcon"/> <span>Delivery</span></li>

                <p className="title">System</p>
                <li> <NotificationsIcon className="sideBarIcon"/> <span>Notifications</span></li>
                <li> <SettingsIcon className="sideBarIcon"/> <span>Settings</span></li>
                
                <p className="title">User</p>
                <li> <PersonIcon className="sideBarIcon"/> <span>Profile</span></li>
                <li> <LogoutIcon className="sideBarIcon"/> <span>Logout</span></li>
            </ul>
        </div>
        <div className="bottom">
            <div className="colorOptions"></div>
            <div className="colorOptions"></div>
        </div>
    
    </div>
  )
}

export default SideBar
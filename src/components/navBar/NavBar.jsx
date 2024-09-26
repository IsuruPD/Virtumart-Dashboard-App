import React, { useState, useEffect } from 'react';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import navLogo from './../../assets/logoimg.png';

import "./navBar.scss";

const NavBar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update current date and time every second
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs only once on mount

  const formattedDateTime = currentDateTime.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
  });

  return (
    <div className="navBar">
      <div className="wrapper">
          <div className="empty">
              
          </div>
          <div className='items'>
              <div className="item">
                {formattedDateTime}
              </div>
              {/* <div className="item">
                <ChatBubbleOutlinedIcon id='chatIcon' className='navBarIcon'/>
                <div className="counter">10</div>
                Chats
              </div>
              <div className="item">
                <ListOutlinedIcon className='navBarIcon'/>
                Menu
              </div> */}
              <div className="item" id="profileImage">
                <img src={navLogo} alt="Profile Picture" className='avatar'/>
              </div>
          </div>
        
      </div>
    </div>
  )
}

export default NavBar;
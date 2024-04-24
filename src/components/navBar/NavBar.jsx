import React from 'react';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

import "./navBar.scss";

const NavBar = () => {
  return (
    <div className="navBar">
      <div className="wrapper">
          <div className="search">
              <input type="text" placeholder="Search here..."/>
              <SearchOutlinedIcon id= 'searchIcon' className='navBarIcon'/>
          </div>
          <div className='items'>
              <div className="item">
                <LanguageOutlinedIcon className='navBarIcon'/>
                English
              </div>
              <div className="item">
                <ChatBubbleOutlinedIcon id='chatIcon' className='navBarIcon'/>
                <div className="counter">10</div>
                Chats
              </div>
              <div className="item">
                <ListOutlinedIcon className='navBarIcon'/>
                Menu
              </div>
              <div className="item" id="profileImage">
                <img src="https://images.pexels.com/photos/103123/pexels-photo-103123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Profile Picture" className='avatar'/>
              </div>
          </div>
        
      </div>
    </div>
  )
}

export default NavBar